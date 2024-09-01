import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderModel } from '../entities/orders.entity';
import { Repository } from 'typeorm';
import {
  NewOrderResponseInterface,
  OrderBodyInterface,
  OrderStatusEnum,
} from '../interfaces/orders.interface';
import { StripeService } from '../../stripe/services/stripe.service';
import { STRIPE_PAYMENT_METHOD } from '../../utils/const/stripe';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderModel)
    private readonly orderRepository: Repository<OrderModel>,
    private readonly stripeService: StripeService,
  ) {}

  //TODO: Add function to return all orders for specific user

  //TODO: Add function to return data of specific order

  public async updateOrderStatus(id: number, status: OrderStatusEnum) {
    return this.orderRepository.update(id, { status });
  }

  public async getAllNewOrdersForScheduler() {
    return this.orderRepository.find({
      where: { status: OrderStatusEnum.NEW },
    });
  }

  public async getAllPendingOrdersForScheduler() {
    return this.orderRepository.find({
      where: {
        status: OrderStatusEnum.PENDING,
        payment_method: STRIPE_PAYMENT_METHOD,
      },
    });
  }

  public async createNewOrder(
    order: OrderBodyInterface,
  ): Promise<NewOrderResponseInterface> {
    const { products, payment_method } = order;
    const parsed_products = JSON.parse(products);
    const { id } = await this.orderRepository.save({
      ...order,
      status: OrderStatusEnum.NEW,
    });
    if (payment_method !== STRIPE_PAYMENT_METHOD) {
      return { message: 'Order placed successfully', url: null };
    }
    const url = await this.stripeService.createPayment(parsed_products, id);
    return { message: 'Order placed successfully', url };
  }
}
