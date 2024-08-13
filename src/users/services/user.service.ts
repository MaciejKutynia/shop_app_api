import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findOne(
    id: number | string,
    field: string = 'id',
  ): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { [field]: id } });
  }

  async checkPassword(plain_password: string, password: string) {
    return await bcrypt.compare(plain_password, password);
  }

  async createPassword(
    password: string,
    saltNum: number,
    length?: number,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltNum);
    const hashedPassword = await bcrypt.hash(password, salt);
    return length ? hashedPassword.slice(0, length) : hashedPassword;
  }

  async checkEmail(email: string) {
    const user = await this.findOne(email, 'email');
    return !!user;
  }

  async createUser(email: string, plain_password: string) {
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

  private async createAdditionalToken(length?: number): Promise<string> {
    const time = new Date().getTime();
    return await this.createPassword(time.toString(), 3, length);
  }
}
