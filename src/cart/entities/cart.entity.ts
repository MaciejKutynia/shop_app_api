import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('cart')
export class CartModel {
  @Field()
  @PrimaryColumn({ type: 'varchar', name: 'uuid', length: 255 })
  readonly uuid: string;

  @Field({ nullable: true })
  @Column({ type: 'int', name: 'user_id', nullable: true })
  readonly user_id: number | null;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'products', nullable: true })
  readonly products: string | null;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'prices', nullable: true })
  readonly prices: string | null;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'shipping_method', nullable: true })
  readonly shipping_method: string;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'payment_method', nullable: true })
  readonly payment_method: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  readonly created_at: number;

  @Field()
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  readonly updated_at: number;

  @Field({ nullable: true })
  readonly new?: boolean;
}
