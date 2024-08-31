import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatusEnum } from '../interfaces/orders.interface';

@ObjectType()
@Entity('orders')
export class OrderModel {
  @Field()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;

  @Field({ nullable: true })
  @Column({ type: 'int', name: 'user_id', nullable: true })
  readonly user_id: number | null;

  @Field()
  @Column({ type: 'varchar', name: 'products', length: 10000 })
  readonly products: string;

  @Field()
  @Column({ type: 'float', name: 'price' })
  readonly price: number;

  @Field()
  @Column({ type: 'varchar', length: 200, name: 'shipping_method' })
  readonly shipping_method: string;

  @Field()
  @Column({ type: 'varchar', length: 200, name: 'payment_method' })
  readonly payment_method: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 20,
    name: 'status',
    default: OrderStatusEnum.NEW,
  })
  readonly status: OrderStatusEnum;
}
