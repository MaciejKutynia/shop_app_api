import { Module } from '@nestjs/common';
import { StripeService } from './services/stripe.service';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModel } from './entities/stripe.entity';

@Module({
  imports: [
    ConfigModule,
    ProductsModule,
    TypeOrmModule.forFeature([StripeModel]),
  ],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
