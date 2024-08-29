import { AuthService } from '../auth.service';
import { UserService } from '../../../users/services/user.service';
import { AddressService } from '../../../addresses/services/address.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressModel } from '../../../addresses/entities/address.entity';
import { UserModel } from '../../../users/entities/user.entity';
import { CreateUserInterface } from '../../../users/interfaces/user.interface';
import { ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let addressService: AddressService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserModel),
          useClass: Repository,
        },
      ],
    }).compile();
    const addressModule: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(AddressModel),
          useClass: Repository,
        },
      ],
    }).compile();

    const userRepo = userModule.get<Repository<UserModel>>(
      getRepositoryToken(UserModel),
    );
    const addressRepo = userModule.get<Repository<AddressModel>>(
      getRepositoryToken(AddressModel),
    );

    userService = new UserService(userRepo);
    addressService = new AddressService(addressRepo);
    jwtService = new JwtService();
    authService = new AuthService(addressService, jwtService, userService);
  });

  it('should register a new user successfully', async () => {
    const data = {
      email: 'test@example.com',
      password: 'Password123!',
      address: {},
    };
    jest.spyOn(userService, 'checkEmail').mockResolvedValue(false);
    jest.spyOn(userService, 'createUser').mockResolvedValue({ id: 1 });
    jest
      .spyOn(addressService, 'createAddress')
      .mockResolvedValue({} as AddressModel);

    const result = await authService.registerUser(data as CreateUserInterface);
    expect(result).toEqual({});
  });

  it('should throw ForbiddenException if email already exists', async () => {
    const data = {
      email: 'test@example.com',
      password: 'Password123!',
      address: {},
    };
    jest.spyOn(userService, 'checkEmail').mockResolvedValue(true);

    await expect(
      authService.registerUser(data as CreateUserInterface),
    ).rejects.toThrow(ForbiddenException);
  });
});
