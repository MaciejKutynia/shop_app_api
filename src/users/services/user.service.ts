import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { UserModel } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
  ) {}

  public async findOne(
    id: number | string,
    field: string = 'id',
  ): Promise<UserModel> {
    return this.userRepo.findOne({ where: { [field]: id } });
  }

  public async getUserById(id: number): Promise<Partial<UserModel>> {
    const user = await this.findOne(id);
    return this.returnUserWithoutPassword(user);
  }

  public async checkPassword(plain_password: string, password: string) {
    return await bcrypt.compare(plain_password, password);
  }

  public async checkEmail(email: string) {
    const user = await this.findOne(email, 'email');
    return !!user;
  }

  public async createUser(email: string, plain_password: string) {
    const access_token = await this.createAdditionalToken(10);
    const password = await this.createPassword(plain_password, 12);
    const user = await this.userRepo.save({
      email,
      password,
      access_token,
      is_blocked: 1,
      rp_token: null,
    });

    return { id: user.id };
  }

  public async activateUser(id: number) {
    await this.userRepo.update(id, { is_blocked: 0 });
  }

  private async createPassword(
    password: string,
    saltNum: number,
    length?: number,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltNum);
    const hashed_password = await bcrypt.hash(password, salt);
    return length ? hashed_password.slice(0, length) : hashed_password;
  }

  private async createAdditionalToken(length?: number): Promise<string> {
    const time = new Date().getTime();
    return await this.createPassword(time.toString(), 3, length);
  }

  private returnUserWithoutPassword(
    user: UserModel,
    fields_to_remove: string[] = [],
  ): Partial<UserModel> {
    const standard_fields_to_remove = [
      'password',
      'access_token',
      'rp_token',
      'is_blocked',
    ];
    for (const field of [...fields_to_remove, ...standard_fields_to_remove]) {
      delete user[field];
    }
    return user;
  }
}
