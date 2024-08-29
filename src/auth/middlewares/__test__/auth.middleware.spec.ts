import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { AuthMiddleware } from '../auth.middleware';
import { UserService } from '../../../users/services/user.service';
import { UserModel } from '../../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let userRepo: Repository<UserModel>;
  let jwtService: JwtService;
  let userService: UserService;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserModel),
          useClass: Repository,
        },
      ],
    }).compile();

    userRepo = module.get<Repository<UserModel>>(getRepositoryToken(UserModel));
    jwtService = new JwtService({ secret: 'test' });
    userService = new UserService(userRepo);
    authMiddleware = new AuthMiddleware(jwtService, userService);
    req = { headers: {} };
    res = {};
    next = jest.fn();
  });

  it('should call next if no token is provided', async () => {
    await authMiddleware.use(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
