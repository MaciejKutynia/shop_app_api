import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from '../services/cart.service';
import { GraphQLContext } from '../../interfaces';
import { CartModel } from '../entities/cart.entity';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query((returns) => CartModel)
  async getCart(
    @Context() ctx: GraphQLContext,
    @Args({ name: 'cartID', type: () => String, nullable: true })
    cartID: string,
  ) {
    const { id: user_id } = ctx?.req?.user || {};
    return this.cartService.getCart(user_id, cartID);
  }

  @Mutation((returns) => CartModel)
  async addProductToCart(
    @Args({
      name: 'cartID',
      type: () => String!,
    })
    cartID: string,
    @Args({ name: 'sku', type: () => String! }) sku: string,
    @Args({ name: 'quantity', type: () => Number, nullable: true })
    quantity: number,
  ) {
    return this.cartService.addProductToCart(sku, quantity || 1, cartID);
  }
}
