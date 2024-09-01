import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TokenBlackListService } from '../../tokenBlackList/services/tokenBlackList.service';
import { CartService } from '../../cart/services/cart.service';
import { OrdersService } from '../../orders/services/orders.service';
import { OrderStatusEnum } from '../../orders/interfaces/orders.interface';
import { StripeService } from '../../stripe/services/stripe.service';
import { STRIPE_PAYMENT_METHOD } from '../../utils/const/stripe';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly cartService: CartService,
    private readonly ordersService: OrdersService,
    private readonly stripeService: StripeService,
    private readonly tokenBlackListService: TokenBlackListService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkBlackListTokens() {
    await this.tokenBlackListService.checkTokens();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkAbandonedCarts() {
    await this.cartService.checkCartsExpired();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async changeOrdersToPending() {
    const orders = await this.ordersService.getAllNewOrdersForScheduler();
    for (const order of orders) {
      await this.ordersService.updateOrderStatus(
        order.id,
        order.payment_method !== STRIPE_PAYMENT_METHOD
          ? OrderStatusEnum.COMPLETED
          : OrderStatusEnum.PENDING,
      );
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async checkPendingOrders() {
    const orders = await this.ordersService.getAllPendingOrdersForScheduler();
    for (const order of orders) {
      const { session_id } = await this.stripeService.getSessionID(order.id);
      const payment_status =
        await this.stripeService.checkOrderStatus(session_id);
      await this.ordersService.updateOrderStatus(
        order.id,
        payment_status === 'no_payment_required' || 'paid'
          ? OrderStatusEnum.COMPLETED
          : OrderStatusEnum.CANCELED,
      );
    }
  }
}
