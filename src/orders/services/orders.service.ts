import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderModel } from '../entities/orders.entity';
import { Repository } from 'typeorm';
import {
  OrderBodyInterface,
  OrderStatusEnum,
} from '../interfaces/orders.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderModel)
    private readonly orderRepository: Repository<OrderModel>,
  ) {}

  //TODO: Add function to return all orders for specific user

  //TODO: Add function to return data of specific order

  public async updateOrderStatus(id: number, status: OrderStatusEnum) {
    return this.orderRepository.update(id, { status });
  }

  public async createNewOrder(order: OrderBodyInterface) {
    return this.orderRepository.save({ ...order, status: OrderStatusEnum.NEW });
  }
}
