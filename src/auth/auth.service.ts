import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from 'src/users';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './token-payload.interface';

const configService = new ConfigService();

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(user: User, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}ms`,
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: true,
      expires: expiresAccessToken,
    });
  }

  public async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
