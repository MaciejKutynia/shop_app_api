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
  async loginUser(
    @Body() login_data: LoginDataInterface,
    @Res() res: Response,
  ) {
    const token = await this.authService.loginUser(login_data);
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
  async createUser(@Body() create_user: CreateUserInterface) {
    return this.authService.registerUser(create_user);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logoutUser(@Req() req: Request, @Body() token: string) {
    return this.authService.logoutUser(token);
  }

  @Post('verify-token')
  async verifyToken(@Body() { token }: { token: string }) {
    return this.authService.verifyToken(token);
  }

  @Post('recover-password')
  async recoverPassword(@Body() email: string) {
    return this.authService.recoveryPassword(email);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: Request, @Body() new_password: string) {
    const { id } = req.user;
    return this.authService.changePassword(id, new_password);
  }

  @Post('activate-account')
  async activateAccount(@Body() access_token: string) {
    return this.authService.activateAccount(access_token);
  }
}
