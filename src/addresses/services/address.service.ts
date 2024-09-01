import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressModel } from '../entities/address.entity';
import { Repository } from 'typeorm';
import {
  CreateAddressInterface,
  UpdateAddressInterface,
} from '../interfaces/address.interface';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressModel)
    private readonly addressRepo: Repository<AddressModel>,
  ) {}

  /**
   * Retrieves all addresses for a given user.
   *
   * @param {number} user_id - The ID of the user.
   * @returns {Promise<AddressModel[]>} - A promise that resolves to an array of address entities.
   */
  public async getAllAddresses(user_id: number): Promise<AddressModel[]> {
    return this.addressRepo.find({ where: { user_id } });
  }

  /**
   * Retrieves a specific address for a given user.
   *
   * @param {number} user_id - The ID of the user.
   * @param {number} id - The ID of the address.
   * @returns {Promise<AddressModel>} - A promise that resolves to the address entity.
   */
  public async getAddress(user_id: number, id: number): Promise<AddressModel> {
    return this.addressRepo.findOne({ where: { user_id, id } });
  }

  /**
   * Creates a new address for a given user.
   *
   * @param {number} user_id - The ID of the user.
   * @param {CreateAddressInterface} newAddress - The data for the new address.
   * @returns {Promise<AddressModel>} - A promise that resolves to the created address entity.
   */
  public async createAddress(
    user_id: number,
    newAddress: CreateAddressInterface,
  ): Promise<AddressModel> {
    const { address: parsed_address, ...rest } = newAddress;
    const address = JSON.stringify(parsed_address);
    return this.addressRepo.save({ ...rest, address, user_id });
  }

  /**
   * Updates an existing address.
   *
   * @param {number} user_id - The ID of the user to update address.
   * @param {number} id - The ID of the address to update.
   * @param {UpdateAddressInterface} updatedAddress - The updated address data.
   * @returns {Promise<AddressModel>} - A promise that resolves to the updated address entity.
   */
  public async updateAddress(
    user_id: number,
    id: number,
    updatedAddress: UpdateAddressInterface,
  ): Promise<AddressModel> {
    const { address: parsed_address, ...rest } = updatedAddress;
    const address = parsed_address ? JSON.stringify(parsed_address) : null;
    await this.addressRepo.update(id, {
      ...rest,
      ...(address ? { address } : {}),
    });
    return this.addressRepo.findOne({ where: { id, user_id } });
  }
}
