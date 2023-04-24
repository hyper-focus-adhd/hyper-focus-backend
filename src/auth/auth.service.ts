import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcryptjs';

import { jwtConfig } from '../config/jwt.config';
import { MessagesHelper } from '../helpers/messages.helper';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    username: string,
    email: string,
    password: string,
  ): Promise<Tokens> {
    // Check if username and email are in use is in use
    const existingUser = await this.usersService.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException(MessagesHelper.USER_EXISTS);
      }
      if (existingUser.email === email) {
        throw new ConflictException(MessagesHelper.EMAIL_EXISTS);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.usersService.create(username, email, hashedPassword);

    // TODO: verify if this validation is necessary
    const user = await this.validateUser(username, password);

    const tokens = await this.generateToken(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async login(username: string, password: string): Promise<Tokens> {
    const user = await this.validateUser(username, password);

    const tokens = await this.generateToken(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(id: string): Promise<boolean> {
    const user = await this.usersService.findOne({ where: { id } });
    if (!user || !user.hashedRefreshToken) {
      return false;
    }
    await this.usersService.update(id, { hashedRefreshToken: null });
    return true;
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException(MessagesHelper.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(MessagesHelper.INVALID_CREDENTIALS);
    }
    return user;
  }

  async generateToken(user: User): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      username: user.username,
      sub: user.id,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: jwtConfig.accessTokenSecret,
        expiresIn: jwtConfig.accessExpiresIn,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: jwtConfig.refreshTokenSecret,
        expiresIn: jwtConfig.refreshExpiresIn,
      }),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshTokens(id: string, refreshToken: string) {
    const user = await this.usersService.findOne({ where: { id } });
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException(MessagesHelper.ACCESS_DENIED);
    }

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new ForbiddenException(MessagesHelper.ACCESS_DENIED);

    const tokens = await this.generateToken(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshTokenHash(
    id: string,
    refreshToken: string,
  ): Promise<void> {
    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.update(id, {
      hashedRefreshToken: hashRefreshToken,
    });
  }
}
