import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stripe')
export class StripeModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;

  @Column({ type: 'int', name: 'order_id' })
  readonly order_id: number;

  @Column({ type: 'varchar', name: 'session_id', length: 255 })
  readonly session_id: string;
}
