import {
  forwardRef,
  Inject,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UsersService } from 'src/users';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(user: User, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getTime() +
        parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}ms`,
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}ms`,
    });

    console.log({ accessToken, refreshToken });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: true,
      expires: expiresAccessToken,
    });

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: expiresRefreshToken,
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

  public async verifyAsyncUserRefreshToken(
    refreshToken: string,
    userId: number,
  ) {
    try {
      const user = await this.usersService.findOneById(userId);
      const authenticated = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!authenticated) {
        throw new UnauthorizedException('Invalid refreshToken');
      }
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async logOut(@Res({ passthrough: true }) res) {
    res.cookie('Authentication', '', { expires: new Date(Date.now()) });
    res.cookie('Refresh', '', { expires: new Date(Date.now()) });
    return {};
  }
}
