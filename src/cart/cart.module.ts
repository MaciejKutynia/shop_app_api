import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModel } from './entities/cart.entity';
import { CartService } from './services/cart.service';
import { CartResolver } from './resolvers/cart.resolver';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartModel]), ProductsModule],
  providers: [CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}
