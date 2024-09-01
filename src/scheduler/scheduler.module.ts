import { Module } from '@nestjs/common';
import { SchedulerService } from './services/scheduler.service';
import { TokenBlackListModule } from '../tokenBlackList/tokenBlackList.module';
import { CartModule } from '../cart/cart.module';
import { OrdersModule } from '../orders/orders.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [CartModule, OrdersModule, StripeModule, TokenBlackListModule],
  providers: [SchedulerService],
})
export class AppSchedulerModule {}
