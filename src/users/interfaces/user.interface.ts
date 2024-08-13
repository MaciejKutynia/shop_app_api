import { CreateAddressInterface } from '../../addresses/interfaces/address.interface';

export type CreateUserInterface = {
  email: string;
  password: string;
} & CreateAddressInterface;

export type LoginDataInterface = {
  email: string;
  password: string;
};
