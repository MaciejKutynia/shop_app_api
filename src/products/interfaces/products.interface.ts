import { ProductsModel } from '../entities/products.entity';

export type FiltersInterface = {
  price: [number, number];
  variant: string;
};

export type SortInterface = {
  orderBy: string | null;
  direction: 'ASC' | 'DESC';
};

export type ProductsResponseInterface = {
  products: ProductsModel[];
  count: number;
};
