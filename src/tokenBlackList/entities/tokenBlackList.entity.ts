import { Entity, PrimaryColumn } from 'typeorm';

@Entity('black_list')
export class TokenBlackListModel {
  @PrimaryColumn({ type: 'varchar', length: 255, name: 'token' })
  token: string;
}
