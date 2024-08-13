import { AuthController } from '../auth.controller';
import { AuthService } from '../../services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserInterface } from '../../../users/interfaces/user.interface';
import { CreateAddressInterface } from '../../../addresses/interfaces/address.interface';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginUser: jest.fn(),
            registerUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should log in a user with valid credentials', async () => {
    const loginData = { email: 'test@example.com', password: 'Password123!' };
    const res = {
      cookie: jest.fn(),
    } as any;
    const result = 'valid-token';
    jest.spyOn(authService, 'loginUser').mockResolvedValue(result);

    await authController.loginUser(loginData, res);

    expect(res.cookie).toHaveBeenCalledWith('token', result, {
      domain: undefined,
      secure: false,
      httpOnly: false,
      maxAge: Number(process.env.JWT_EXPIRES_IN),
    });
  });

  it('should register a new user with valid data', async () => {
    const createdAddress: CreateAddressInterface = {
      address: ['Testowa', '2', '12'],
      city: 'Testowo',
      zip_code: '12-345',
      phone: '123456789',
      first_name: 'Test',
      last_name: 'Test',
      type: null,
    };

    const createdUser: CreateUserInterface = {
      email: 'test@example.com',
      password: 'Password123!',
      ...createdAddress,
    };

    jest.spyOn(authService, 'registerUser').mockResolvedValue({
      ...createdAddress,
      address: JSON.stringify(createdAddress.address),
      user_id: 1,
      id: 5,
    });

    expect(await authController.createUser(createdUser)).toEqual({
      ...createdAddress,
      address: JSON.stringify(createdAddress.address),
      user_id: 1,
      id: 5,
    });
  });

  it('', async () => {});
});
