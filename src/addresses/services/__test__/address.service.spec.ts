import { AddressService } from '../address.service';
import { Repository } from 'typeorm';
import { AddressModel } from '../../entities/address.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { addressMock } from '../../interfaces/__test__/address.mock';
import {
  CreateAddressInterface,
  UpdateAddressInterface,
} from '../../interfaces/address.interface';

describe('AddressService', () => {
  let addressService: AddressService;
  let addressRepo: Repository<AddressModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(AddressModel),
          useClass: Repository,
        },
      ],
    }).compile();

    addressService = module.get<AddressService>(AddressService);
    addressRepo = module.get<Repository<AddressModel>>(
      getRepositoryToken(AddressModel),
    );
  });

  it('should retrieve all addresses for a user', async () => {
    const user_id = 1;
    const addresses = addressMock.filter(
      (address) => address.user_id === user_id,
    );
    jest.spyOn(addressRepo, 'find').mockResolvedValue(addresses);

    expect(await addressService.getAllAddresses(user_id)).toEqual(addresses);
  });

  it('should retrieve a specific address for a user', async () => {
    const user_id = 1;
    const id = 1;
    const address = addressMock.find(
      (address) => address.user_id === user_id && address.id === id,
    );
    jest.spyOn(addressRepo, 'findOne').mockResolvedValue(address);

    expect(await addressService.getAddress(user_id, id)).toEqual(address);
  });

  it('should create a new address for a user', async () => {
    const user_id = 1;
    const newAddress: CreateAddressInterface = {
      address: ['Testowo', '33', ''],
      city: 'Test city',
      zip_code: '12345',
      phone: '123456789',
      first_name: 'Test',
      last_name: 'Test',
      type: null,
    };
    const createdAddress = {
      user_id,
      id: 4,
      ...newAddress,
      address: JSON.stringify(newAddress.address),
    };
    jest.spyOn(addressRepo, 'save').mockResolvedValue(createdAddress);

    expect(await addressService.createAddress(user_id, newAddress)).toBe(
      createdAddress,
    );
  });

  it('should update an existing address', async () => {
    const id = 1;
    const existingAddress = addressMock[0];
    const updatedAddress: UpdateAddressInterface = {
      city: 'Testerowo',
    };
    jest.spyOn(addressRepo, 'update').mockResolvedValue(undefined);
    jest.spyOn(addressRepo, 'findOne').mockResolvedValue({
      ...existingAddress,
      ...updatedAddress,
      address: JSON.stringify(existingAddress.address),
    });

    expect(await addressService.updateAddress(id, updatedAddress)).toEqual({
      ...existingAddress,
      ...updatedAddress,
      address: JSON.stringify(existingAddress.address),
    });
  });

  it('should return empty array if no addresses found for a user', async () => {
    const user_id = 2;
    jest.spyOn(addressRepo, 'find').mockResolvedValue([]);

    expect(await addressService.getAllAddresses(user_id)).toEqual([]);
  });

  it('should return null if specific address not found for a user', async () => {
    const user_id = 2;
    const id = 1;
    jest.spyOn(addressRepo, 'findOne').mockResolvedValue(null);

    expect(await addressService.getAddress(user_id, id)).toBeNull();
  });
});
