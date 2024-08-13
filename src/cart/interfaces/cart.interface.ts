export type CreateCartInterface = {
  user_id: number;
  products: any;
  prices: any;
  payment_method?: string;
  shipping_method?: string;
};

export type UpdateCartInterface = Partial<CreateCartInterface>;
