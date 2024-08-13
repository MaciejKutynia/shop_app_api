import { AddressModel } from '../../entities/address.entity';

export const addressMock: AddressModel[] = [
  {
    address: "['Test','1','2']",
    first_name: 'Test',
    last_name: 'Test',
    zip_code: '12-345',
    id: 1,
    user_id: 1,
    city: 'Test',
    type: 'shipping',
    phone: '123456789',
  },
  {
    address: "['Test','12','']",
    company: 'Testex',
    vat_id: '1111111111',
    zip_code: '12-345',
    id: 1,
    user_id: 1,
    city: 'Test',
    type: 'billing',
    phone: '123456789',
  },
  {
    address: "['Test','1','2']",
    first_name: 'Test',
    last_name: 'Test',
    zip_code: '12-345',
    id: 1,
    user_id: 1,
    city: 'Test',
    type: null,
    phone: '123456789',
  },
];
