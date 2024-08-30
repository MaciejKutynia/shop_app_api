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
import { TokenBlackListService } from '../../tokenBlackList/services/tokenBlackList.service';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly addressService: AddressService,
    private readonly tokenBlackListService: TokenBlackListService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
  public async loginUser(data: LoginDataInterface): Promise<string> {
    const { email, password: plain_password } = data;

    const user = await this.userService.findOne(email, 'email');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, is_blocked, id } = user;

    if (is_blocked) {
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
  public async registerUser(data: CreateUserInterface): Promise<AddressModel> {
    const { email, password, ...address } = data;

    const isEmailExists = await this.userService.checkEmail(email);
    if (isEmailExists) {
      throw new ForbiddenException('Email already exists');
    }

    const { id } = await this.userService.createUser(email, password);

    // TODO: add possibility of sending email with activation link

    return this.addressService.createAddress(id, address);
  }

  /**
   * Verifies the provided JWT token.
   *
   * @param {string} token - The JWT token to verify.
   * @returns {Promise<any>} - The user associated with the token if valid.
   * @throws {UnauthorizedException} - If the token is invalid or the user does not exist.
   */
  public async verifyToken(token: string): Promise<Partial<UserModel>> {
    try {
      const decodedPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const { id } = decodedPayload;
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const isTokenInBlackList =
        await this.tokenBlackListService.checkToken(token);

      if (isTokenInBlackList) {
        throw new UnauthorizedException('Invalid token');
      }

      return user;
    } catch (e) {
      console.log('Error validating token: ', e);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Logs out a user by adding the provided token to the blacklist.
   *
   * @param {string} token - The JWT token to blacklist.
   * @returns {Promise<void>}
   */
  public async logoutUser(token: string): Promise<void> {
    await this.tokenBlackListService.addToken(token);
  }

  public async activateAccount(access_token: string): Promise<void> {
    const user = await this.userService.findOne(access_token, 'access_token');
    if (!user) {
      throw new UnauthorizedException("User don't exist");
    }
    await this.userService.activateUser(user.id);
  }

  // TODO: Add possibility of password recovery
  public async recoveryPassword(email: string): Promise<string> {
    return email;
  }

  // TODO: Add possibility of changing password
  public async changePassword(
    id: number,
    newPassword: string,
  ): Promise<{ id: number; newPassword: string }> {
    return { id, newPassword };
  }
}
