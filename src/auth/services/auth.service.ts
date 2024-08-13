import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../../users/services/user.service';
import {
  CreateUserInterface,
  LoginDataInterface,
} from '../../users/interfaces/user.interface';
import { AddressService } from '../../addresses/services/address.service';
import { AddressModel } from '../../addresses/entities/address.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly addressService: AddressService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Logs in a user with the provided credentials.
   *
   * @param {LoginDataInterface} data - The login data containing email and password.
   * @returns {Promise<string>} - A promise that resolves to a JWT token if login is successful.
   * @throws {UnauthorizedException} - If the credentials are invalid.
   * @throws {ForbiddenException} - If the user is blocked.
   */
  async loginUser(data: LoginDataInterface): Promise<string> {
    const { email, password: plain_password } = data;

    const user = await this.userService.findOne(email, 'email');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, is_blocked, id } = user;

    if (!!is_blocked) {
      throw new ForbiddenException('User is blocked');
    }

    const isPasswordValid = await this.userService.checkPassword(
      plain_password,
      password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  /**
   * Registers a new user with the provided data.
   *
   * @param {CreateUserInterface} data - The data required to create a new user, including email, password, and address details.
   * @returns {Promise<AddressModel>} - A promise that resolves to the created address entity.
   * @throws {ForbiddenException} - If the email already exists.
   */
  async registerUser(data: CreateUserInterface): Promise<AddressModel> {
    const { email, password, ...address } = data;

    const isEmailExists = await this.userService.checkEmail(email);
    if (isEmailExists) {
      throw new ForbiddenException('Email already exists');
    }

    const { id } = await this.userService.createUser(email, password);

    // TODO: wysłanie maila z linkiem aktywacyjnym

    return this.addressService.createAddress(id, address);
  }
}
