import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from '../services/products.service';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/guards/auth.guard';
import {
  CreateProductInput,
  GetProductsInput,
  ProductsResponse,
} from '../models/products.model';
import { ProductsModel } from '../entities/products.entity';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => ProductsResponse)
  async getProducts(
    @Args({
      name: 'params',
      type: () => GetProductsInput,
    })
    params: GetProductsInput,
  ) {
    return this.productsService.getAllProducts(params);
  }

  @Mutation(() => ProductsModel)
  @UseGuards(AdminGuard)
  async createProduct(
    @Args({ name: 'product', type: () => CreateProductInput })
    product: CreateProductInput,
  ) {
    return this.productsService.createProduct(product);
  }
}
