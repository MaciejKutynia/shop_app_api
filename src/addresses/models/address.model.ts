import { Field, InputType } from '@nestjs/graphql';
import { AddressType } from '../interfaces/address.interface';

@InputType()
export class CreateAddressInput {
  @Field(() => [String])
  address: [string, string, string];

  @Field()
  city: string;

  @Field()
  zip_code: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  last_name?: string;

  @Field({ nullable: true })
  company?: string;

  @Field({ nullable: true })
  vat_id?: string;

  @Field(() => String, { nullable: true })
  type: AddressType;
}

@InputType()
export class UpdateAddressInput {
  @Field(() => [String], { nullable: true })
  address: [string, string, string];

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  zip_code: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  first_name?: string;

  @Field({ nullable: true })
  last_name?: string;

  @Field({ nullable: true })
  company?: string;

  @Field({ nullable: true })
  vat_id?: string;

  @Field(() => String, { nullable: true })
  type: AddressType;
}
