import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from '../services/cart.service';
import { GraphQLContext } from '../../interfaces';
import { CartModel } from '../entities/cart.entity';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartModel)
  async getCart(
    @Context() ctx: GraphQLContext,
    @Args({ name: 'cart_id', type: () => String, nullable: true })
    cart_id: string,
  ) {
    const { id: user_id } = ctx?.req?.user || {};
    return this.cartService.getCart(user_id, cart_id);
  }

  @Mutation(() => CartModel)
  async addProductToCart(
    @Args({
      name: 'cart_id',
      type: () => String!,
    })
    cart_id: string,
    @Args({ name: 'sku', type: () => String! }) sku: string,
    @Args({ name: 'quantity', type: () => Number, nullable: true })
    quantity: number,
  ) {
    return this.cartService.addProductToCart(sku, quantity || 1, cart_id);
  }

  @Mutation(() => CartModel)
  async mergeCarts(
    @Context() ctx: GraphQLContext,
    @Args({
      name: 'cart_id',
      type: () => String!,
    })
    cart_id: string,
  ) {
    return this.cartService.mergeCarts(ctx.req.user.id, cart_id);
  }

  @Mutation(() => String)
  async placeOrder(
    @Args({
      name: 'cart_id',
      type: () => String!,
    })
    cart_id: string,
  ) {
    return this.cartService.placeOrder(cart_id);
  }
}
