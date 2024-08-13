import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id?: number;

  @Column({ type: 'varchar', length: 255, name: 'password' })
  password: string;

  @Column({ type: 'varchar', length: 255, name: 'email' })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'access_token',
    nullable: true,
  })
  access_token?: string;

  @Column({ type: 'varchar', length: 255, name: 'rp_token', nullable: true })
  rp_token?: string;

  @Column({ type: 'int', name: 'is_blocked', nullable: true })
  is_blocked?: number;
}
