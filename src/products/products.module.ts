import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesModule } from '../categories/categories.module';

import { ProductsResolver } from './resolvers/products.resolver';
import { ProductsService } from './services/products.service';

import { ProductsModel } from './entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsModel]), CategoriesModule],
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
