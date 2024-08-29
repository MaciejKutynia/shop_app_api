import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('config')
export class StoreConfigModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Field()
  @Column({ type: 'text', name: 'shipping_methods' })
  shipping_methods: string;

  @Field()
  @Column({ type: 'text', name: 'payment_methods' })
  payment_methods: string;

  @Field({ nullable: true })
  @Column({ type: 'int', name: 'store_id', nullable: true })
  store_id: number | null;
}
