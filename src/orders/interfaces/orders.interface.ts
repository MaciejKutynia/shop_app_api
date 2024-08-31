export enum OrderStatusEnum {
  NEW = 'NEW',
  PENDING = 'PENDING',
  CANCELED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class OrderBodyInterface {
  readonly user_id: number | null;
  readonly products: string;
  readonly price: number;
  readonly shipping_method: string;
  readonly payment_method: string;
}
