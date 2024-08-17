import { Args, Context, Query, Resolver, ID, Mutation } from '@nestjs/graphql';
import { AddressService } from '../services/address.service';
import { AddressModel } from '../entities/address.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { GraphQLContext } from '../../interfaces';

import {
  CreateAddressInput,
  UpdateAddressInput,
} from '../models/address.model';

@Resolver()
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Query((returns) => [AddressModel])
  @UseGuards(AuthGuard)
  async getAddresses(@Context() ctx: GraphQLContext) {
    const { id } = ctx?.req?.user || {};
    return this.addressService.getAllAddresses(id);
  }

  @Query((returns) => AddressModel)
  @UseGuards(AuthGuard)
  async getAddress(
    @Context() ctx: GraphQLContext,
    @Args({ name: 'id', type: () => ID! }) id: number,
  ) {
    const { id: user_id } = ctx?.req?.user || {};
    return this.addressService.getAddress(user_id, id);
  }

  @Mutation((returns) => AddressModel)
  @UseGuards(AuthGuard)
  async createAddress(
    @Context() ctx: GraphQLContext,
    @Args({ name: 'address', type: () => CreateAddressInput })
    address: CreateAddressInput,
  ) {
    const { id } = ctx?.req?.user || {};
    return this.addressService.createAddress(id, address);
  }

  @Mutation((returns) => AddressModel)
  @UseGuards(AuthGuard)
  async updateAddress(
    @Context() ctx: GraphQLContext,
    @Args({
      name: 'id',
      type: () => ID!,
    })
    id: number,
    @Args({ name: 'address', type: () => UpdateAddressInput })
    address: UpdateAddressInput,
  ) {
    const { id: user_id } = ctx?.req?.user || {};
    return this.addressService.updateAddress(user_id, id, address);
  }
}
