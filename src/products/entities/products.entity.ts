import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('products')
export class ProductsModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Field()
  @Column({ type: 'varchar', name: 'name', length: 255 })
  name: string;

  @Field()
  @Column({ type: 'decimal', name: 'price', precision: 10, scale: 2 })
  price: number;

  @Field()
  @Column({ type: 'text', name: 'variants', nullable: true })
  variants: string | null;

  @Field()
  @Column({ type: 'text', name: 'image', nullable: true })
  image: string | null;

  @Field()
  @Column({ type: 'varchar', name: 'url_key', length: 255 })
  url_key: string;

  @Field(() => Int)
  @Column({ type: 'int', name: 'category_id' })
  category_id: number;

  @Field()
  @Column({ type: 'varchar', name: 'sku', length: 255 })
  sku: string;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'description', nullable: true })
  description: string | null;
}
