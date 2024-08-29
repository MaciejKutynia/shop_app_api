import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import {
  CreateUserInterface,
  LoginDataInterface,
} from '../../users/interfaces/user.interface';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginData: LoginDataInterface, @Res() res: Response) {
    const token = await this.authService.loginUser(loginData);
    res
      .cookie('token', token, {
        domain: undefined,
        secure: false,
        httpOnly: false,
        maxAge: 604800,
      })
      .send();
  }

  @Post('register')
  async createUser(@Body() createUser: CreateUserInterface) {
    return this.authService.registerUser(createUser);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logoutUser(@Req() req: Request, @Body() token: string) {
    return this.authService.logoutUser(token);
  }

  @Post('verify-token')
  async verifyToken(@Body() token: string) {
    return this.authService.verifyToken(token);
  }

  // TODO: Add possibility of password recovery
  @Post('recover-password')
  async recoverPassword(@Body() email: string) {
    return 'recover-password';
  }

  // TODO: Add possibility of changing recovery
  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: Request, @Body() newPassword: string) {
    const { id } = req.user;
    return 'change-password';
  }

  @Post('activate-account')
  async activateAccount(@Body() access_token: string) {
    return this.authService.activateAccount(access_token);
  }
}
