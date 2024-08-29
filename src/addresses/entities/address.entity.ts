import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { AddressType } from '../interfaces/address.interface';

@ObjectType()
@Entity('addresses')
export class AddressModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;

  @Field(() => Int)
  @Column({ type: 'int', name: 'user_id' })
  readonly user_id: number;

  @Field()
  @Column({ type: 'text', name: 'address' })
  readonly address: string;

  @Field()
  @Column({ type: 'text', name: 'city' })
  readonly city: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, name: 'type', nullable: true })
  readonly type: AddressType;

  @Field()
  @Column({ type: 'varchar', length: 10, name: 'zip_code' })
  readonly zip_code: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true, name: 'phone' })
  readonly phone?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'first_name' })
  readonly first_name?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_name' })
  readonly last_name?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'company' })
  readonly company?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true, name: 'vat_id' })
  readonly vat_id?: string;
}
