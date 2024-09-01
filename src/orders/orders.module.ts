import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModel } from './entities/orders.entity';
import { OrdersService } from './services/orders.service';
import { OrdersResolver } from './resolvers/orders.resolver';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderModel]), StripeModule],
  providers: [OrdersService, OrdersResolver],
  exports: [OrdersService],
})
export class OrdersModule {}
