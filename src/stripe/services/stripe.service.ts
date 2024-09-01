import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { StripeProductItemInterface } from '../interfaces/stripe.interface';
import { CartProductInterface } from '../../cart/interfaces/cart.interface';
import { ProductsService } from '../../products/services/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { StripeModel } from '../entities/stripe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private productsService: ProductsService,
    @InjectRepository(StripeModel)
    private readonly stripeRepo: Repository<StripeModel>,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_API_KEY'));
  }

  public async getSessionID(order_id: number) {
    const { session_id } = await this.stripeRepo.findOne({
      where: { order_id },
    });
    return session_id;
  }

  public async checkOrderStatus(session_id: string) {
    const { payment_status } =
      await this.stripe.checkout.sessions.retrieve(session_id);
    return payment_status;
  }

  public async createPayment(
    order_products: CartProductInterface[],
    order_id: number,
  ): Promise<string> {
    const products =
      await this.productsService.prepareProductsForStripe(order_products);
    const payment_link = await this.createPaymentLink(products);
    const { url, id: session_id } = payment_link;
    await this.stripeRepo.save({ order_id, session_id });
    return url;
  }

  private async createPaymentLink(
    products: StripeProductItemInterface[],
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return this.stripe.checkout.sessions.create({
      line_items: products.map((product) => ({
        price_data: {
          currency: 'PLN',
          product_data: {
            name: product.name,
          },
          unit_amount_decimal: (product.price * 100).toFixed(2),
        },
        quantity: product.quantity,
      })),
      mode: 'payment',
      success_url: this.configService.get<string>('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.get<string>('STRIPE_CANCEL_URL'),
    });
  }
}
