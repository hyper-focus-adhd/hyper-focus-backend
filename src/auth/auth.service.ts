import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { MessagesHelper } from '../helpers/messages.helper';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(username: string, email: string, password: string) {
    // Check if username and email are in use is in use
    const users = await this.usersService.findOneBy({ username });
    const emails = await this.usersService.findOneBy({ email });

    if (users) {
      throw new BadRequestException('User in use');
    }

    if (emails) {
      throw new BadRequestException('Email in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.usersService.create(username, email, hashedPassword);
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    return this.generateToken(user);
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneBy({ username });
    if (!user) {
      throw new UnauthorizedException(MessagesHelper.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(MessagesHelper.INVALID_CREDENTIALS);
    }
    return user;
  }

  async generateToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
