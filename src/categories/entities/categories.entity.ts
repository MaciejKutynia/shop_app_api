import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class CategoriesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id?: number;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 255, name: 'url_key' })
  url_key: string;

  @Column({ type: 'varchar', length: 255, name: 'children', nullable: true })
  children: string | null;
}
