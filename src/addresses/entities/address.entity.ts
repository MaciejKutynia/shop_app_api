import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { AddressType } from '../interfaces/address.interface';

@ObjectType()
@Entity('addresses')
export class AddressModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id?: number;

  @Field(() => Int)
  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @Field()
  @Column({ type: 'text', name: 'address' })
  address: string;

  @Field()
  @Column({ type: 'text', name: 'city' })
  city: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, name: 'type', nullable: true })
  type: AddressType;

  @Field()
  @Column({ type: 'varchar', length: 10, name: 'zip_code' })
  zip_code: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true, name: 'phone' })
  phone?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'first_name' })
  first_name?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_name' })
  last_name?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'company' })
  company?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true, name: 'vat_id' })
  vat_id?: string;
}
