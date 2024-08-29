import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartModel } from '../entities/cart.entity';
import { Repository } from 'typeorm';
import { CART_EXPIRATION_TIME, createUUID } from '../../utils/cart';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartModel)
    private readonly cartRepo: Repository<CartModel>,
    private readonly productsService: ProductsService,
  ) {}

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
        const newCart = await this.createCart(user_id);
        return { ...newCart, new: true };
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
    const { products, prices = 0 } = cart || {};
    const parsedProducts = products ? JSON.parse(products) : [];
    const existingProduct = parsedProducts.find((p) => p.sku === sku);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      parsedProducts.push({ sku, quantity });
    }
    const updatedPrices = Number(prices) + Number(product.price) * quantity;

    await this.cartRepo.update(
      { uuid },
      {
        products: JSON.stringify(parsedProducts),
        prices: updatedPrices.toFixed(2),
      },
    );
    return this.cartRepo.findOne({ where: { uuid } });
  }

  public async mergeCarts(user_id: number, uuid: string) {
    const userCart = await this.cartRepo.findOne({ where: { user_id } });
    if (!userCart) {
      await this.cartRepo.update({ uuid }, { user_id });
      return this.cartRepo.findOne({ where: { uuid } });
    }
    const cart = await this.cartRepo.findOne({ where: { uuid } });
    const products = cart?.products ? JSON.parse(cart.products) : [];
    const userProducts = userCart?.products
      ? JSON.parse(userCart.products)
      : [];
    const mergedProducts = [];
    for (const userProduct of userProducts) {
      const product = products.find((p) => p.sku === userProduct.sku);
      if (product) {
        userProducts.quantity += product.quantity;
        mergedProducts.push(userProduct);
      } else {
        mergedProducts.push(product);
      }
    }
    console.log(mergedProducts);
    const mergedPrices = cart.prices + userCart.prices;

    /*
     * TODO:
     *  - sprawdzenie ilości tych samych produktów i dodanie ich
     *  - zapisanie nowego koszyka jako istniejącego koszyka użytkownika
     *  - usunięcie koszyka gościa
     * */
  }

  private async createCart(user_id: number | null) {
    const uuids = await this.getUUIDS();
    const uuid = await this.checkUUID(createUUID(), uuids);

    return this.cartRepo.save({ uuid, user_id });
  }

  private async checkUUID(uuid: string, uuids: string[]) {
    if (uuids.includes(uuid)) {
      const newUUIDS = await this.getUUIDS();
      return this.checkUUID(createUUID(), newUUIDS);
    }
    return uuid;
  }

  private async getUUIDS() {
    return (await this.cartRepo.find())?.map((cart) => cart.uuid);
  }
}
