import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcryptjs';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { jwtConfig } from '../../config/jwt.config';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { LoginDto } from './dtos/login.dto';
import { JwtPayload, Tokens } from './types';
import { CreateUserType } from './types/create-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
    profile_image: Express.Multer.File,
  ): Promise<CreateUserType> {
    await this.usersService.verifyExistingUser(createUserDto.username, createUserDto.email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    await this.usersService.createUser(createUserDto, hashedPassword, profile_image);

    return await this.validateUser(createUserDto.username, createUserDto.password);
  }

  async login(loginDto: LoginDto): Promise<object> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    const tokens = await this.generateToken(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return { ...user, ...tokens };
  }

  async logout(userId: string): Promise<boolean> {
    const user = await this.usersService.findOneUser({ where: { id: userId } });
    if (!user || !user.hashed_refresh_token) {
      return false;
    }
    await this.usersService.updateUser(userId, { hashed_refresh_token: null });
    return true;
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneUser({ where: { username } });
    if (!user) {
      throw new UnauthorizedException(messagesHelper.CREDENTIALS_INVALID);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(messagesHelper.CREDENTIALS_INVALID);
    }
    return user;
  }

  async generateToken(user: User): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      username: user.username,
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

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<{
    accessToken: string;
  }> {
    const user = await this.usersService.findOneUser({ where: { id: userId } });
    if (!user || !user.hashed_refresh_token) {
      throw new ForbiddenException(messagesHelper.ACCESS_DENIED);
    }

    const refreshTokenMatches = await argon2.verify(user.hashed_refresh_token, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException(messagesHelper.ACCESS_DENIED);

    const tokens = await this.generateToken(user);

    return { accessToken: tokens.accessToken };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string): Promise<void> {
    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateUser(userId, {
      hashed_refresh_token: hashRefreshToken,
    });
  }
}
