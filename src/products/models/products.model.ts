import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { FiltersInterface } from '../interfaces/products.interface';
import { ProductsModel } from '../entities/products.entity';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  category_id: number;

  @Field()
  image: string;

  @Field(() => [String])
  variants: string[];
}

@InputType()
export class GetProductsInput {
  @Field({ defaultValue: 1, nullable: true })
  page: number;

  @Field({ defaultValue: 10, nullable: true })
  limit: number;

  @Field()
  category_url_key: string;

  @Field({ nullable: true })
  sort: string;

  @Field(() => String, { nullable: true })
  filters: FiltersInterface;
}

@ObjectType()
export class ProductsResponse {
  @Field(() => [ProductsModel])
  products: ProductsModel[];

  @Field(() => Int)
  count: number;
}
