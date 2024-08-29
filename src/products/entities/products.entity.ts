import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('products')
export class ProductsModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id: number;

  @Field()
  @Column({ type: 'varchar', name: 'name', length: 255 })
  readonly name: string;

  @Field()
  @Column({ type: 'decimal', name: 'price', precision: 10, scale: 2 })
  readonly price: number;

  @Field()
  @Column({ type: 'text', name: 'variants', nullable: true })
  readonly variants: string | null;

  @Field()
  @Column({ type: 'text', name: 'image', nullable: true })
  readonly image: string | null;

  @Field()
  @Column({ type: 'varchar', name: 'url_key', length: 255 })
  readonly url_key: string;

  @Field(() => Int)
  @Column({ type: 'int', name: 'category_id' })
  readonly category_id: number;

  @Field()
  @Column({ type: 'varchar', name: 'sku', length: 255 })
  readonly sku: string;

  @Field({ nullable: true })
  @Column({ type: 'text', name: 'description', nullable: true })
  readonly description: string | null;
}
