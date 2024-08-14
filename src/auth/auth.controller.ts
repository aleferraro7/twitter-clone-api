import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { User } from 'src/users';
import { Response } from 'express';
import { AuthService, CurrentUser, LocalAuthGuard } from '.';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
  }
}
