import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cart')
export class CartEntity {
  @PrimaryColumn({ type: 'varchar', name: 'uuid', length: 255 })
  uuid: string;

  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @Column({ type: 'text', name: 'products' })
  products: string;

  @Column({ type: 'text', name: 'prices' })
  prices: string;

  @Column({ type: 'text', name: 'shipping_method', nullable: true })
  shipping_method: string;

  @Column({ type: 'text', name: 'payment_method', nullable: true })
  payment_method: string;
}
