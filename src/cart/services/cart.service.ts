import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartModel } from '../entities/cart.entity';
import { Repository } from 'typeorm';
import { CART_EXPIRATION_TIME, createUUID } from '../../utils/cart';
import { ProductsService } from '../../products/services/products.service';
import { CartProductInterface } from '../interfaces/cart.interface';
import { OrdersService } from '../../orders/services/orders.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartModel)
    private readonly cartRepo: Repository<CartModel>,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  public async placeOrder(uuid: string) {
    const cart = await this.cartRepo.findOne({ where: { uuid } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const { uuid: cart_id, updated_at, created_at, prices, ...order } = cart;
    const order_response_data = await this.ordersService.createNewOrder({
      ...order,
      price: Number(prices),
    });
    await this.cartRepo.delete({ uuid });
    return order_response_data;
  }

  public async checkCartsExpired() {
    const carts = await this.cartRepo.find();
    for (const cart of carts) {
      if (
        (new Date(cart.updated_at).getTime() <
          new Date(Date.now() - CART_EXPIRATION_TIME).getTime() &&
          !cart.user_id) ||
        new Date(cart.updated_at).getTime() <
          new Date(Date.now() - CART_EXPIRATION_TIME * 3).getTime()
      ) {
        await this.cartRepo.delete({ uuid: cart.uuid });
      }
    }
  }

  public async getCart(user_id?: number, cartID?: string) {
    if (cartID) {
      const cart = await this.cartRepo.findOne({ where: { uuid: cartID } });
      if (!cart) {
        const new_cart = await this.createCart(user_id);
        return { ...new_cart, new: true };
      }
      return cart;
    }
    if (!user_id) {
      return this.createCart(null);
    }
    const cart = await this.cartRepo.findOne({ where: { user_id } });
    if (!cart) {
      return this.createCart(user_id);
    }
    return cart;
  }

  public async addProductToCart(sku: string, quantity: number, uuid: string) {
    const cart = await this.cartRepo.findOne({ where: { uuid } });
    const product = await this.productsService.getProductBySku(sku);
    if (!product.available)
      throw new NotFoundException('Product is not available');
    const { products, prices = 0 } = cart || {};
    const parsed_products = products ? JSON.parse(products) : [];
    const existing_product = parsed_products.find(
      (product: CartProductInterface) => product.sku === sku,
    );
    if (existing_product) {
      existing_product.quantity += quantity;
    } else {
      parsed_products.push({ sku, quantity });
    }
    const updated_prices = Number(prices) + Number(product.price) * quantity;

    await this.cartRepo.update(
      { uuid },
      {
        products: JSON.stringify(parsed_products),
        prices: updated_prices.toFixed(2),
      },
    );
    return this.cartRepo.findOne({ where: { uuid } });
  }

  public async mergeCarts(user_id: number, uuid: string) {
    const user_cart = await this.cartRepo.findOne({ where: { user_id } });
    if (!user_cart) {
      await this.cartRepo.update({ uuid }, { user_id });
      return this.cartRepo.findOne({ where: { uuid } });
    }
    const cart = await this.cartRepo.findOne({ where: { uuid } });
    const products = cart?.products ? JSON.parse(cart.products) : [];
    if (!products.length) {
      await this.cartRepo.delete({ uuid });
      return user_cart;
    }
    const user_products = user_cart?.products
      ? JSON.parse(user_cart.products)
      : [];
    for (const product of products) {
      const existing_product = user_products.find(
        (userProduct: CartProductInterface) => userProduct.sku === product.sku,
      );
      if (existing_product) {
        existing_product.quantity += product.quantity;
      } else {
        user_products.push(product);
      }
    }

    const merged_prices = Number(cart.prices) + Number(user_cart.prices);

    await this.cartRepo.update(
      { uuid: user_cart.uuid },
      {
        products: JSON.stringify(user_products),
        prices: merged_prices.toFixed(2),
      },
    );
    await this.cartRepo.delete({ uuid });

    return this.cartRepo.findOne({ where: { user_id } });
  }

  private async createCart(user_id: number | null) {
    const uuids = await this.getUUIDS();
    const uuid = await this.checkUUID(createUUID(), uuids);

    return this.cartRepo.save({ uuid, user_id });
  }

  private async checkUUID(uuid: string, uuids: string[]) {
    if (uuids.includes(uuid)) {
      const new_uuids = await this.getUUIDS();
      return this.checkUUID(createUUID(), new_uuids);
    }
    return uuid;
  }

  private async getUUIDS() {
    return (await this.cartRepo.find())?.map((cart) => cart.uuid);
  }
}
