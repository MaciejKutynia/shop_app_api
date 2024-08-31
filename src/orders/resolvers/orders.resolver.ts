import { Resolver } from '@nestjs/graphql';
import { OrdersService } from '../services/orders.service';

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  //TODO: Add query to return all orders for specific user

  //TODO: Add query to return data of specific order
}
