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
  async getAllAddresses(user_id: number): Promise<AddressModel[]> {
    return this.addressRepo.find({ where: { user_id } });
  }

  /**
   * Retrieves a specific address for a given user.
   *
   * @param {number} user_id - The ID of the user.
   * @param {number} id - The ID of the address.
   * @returns {Promise<AddressModel>} - A promise that resolves to the address entity.
   */
  async getAddress(user_id: number, id: number): Promise<AddressModel> {
    return this.addressRepo.findOne({ where: { user_id, id } });
  }

  /**
   * Creates a new address for a given user.
   *
   * @param {number} user_id - The ID of the user.
   * @param {CreateAddressInterface} newAddress - The data for the new address.
   * @returns {Promise<AddressModel>} - A promise that resolves to the created address entity.
   */
  async createAddress(
    user_id: number,
    newAddress: CreateAddressInterface,
  ): Promise<AddressModel> {
    const { address: parsedAddress, ...rest } = newAddress;
    const address = JSON.stringify(parsedAddress);
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
  async updateAddress(
    user_id: number,
    id: number,
    updatedAddress: UpdateAddressInterface,
  ): Promise<AddressModel> {
    const { address: parsedAddress, ...rest } = updatedAddress;
    const address = parsedAddress ? JSON.stringify(parsedAddress) : null;
    await this.addressRepo.update(id, {
      ...rest,
      ...(address ? { address } : {}),
    });
    return this.addressRepo.findOne({ where: { id, user_id } });
  }
}
