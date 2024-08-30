import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import * as process from 'process';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { UserModel } from '../../users/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')?.[1];
    if (token) {
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        const user: UserModel = await this.usersService.findOne(decoded.id);
        if (user) {
          req.user = {
            id: user.id,
          };
        }
      } catch (e) {
        console.log('Error:', e);
        next(new UnauthorizedException('Token expired'));
      }
    }
    next();
  }
}
