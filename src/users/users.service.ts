import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { jwtConfig } from '../config/jwt.config';
import { messagesHelper } from '../helpers/messages-helper';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.create({
      username,
      email,
      password,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(options);
  }

  async findOneOrFail(options: FindOneOptions<User>): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(options);
    } catch (error: any) {
      throw new NotFoundException(messagesHelper.USER_NOT_FOUND);
    }
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
    const user = await this.findOneOrFail({ where: { id } });

    if (attrs.username || attrs.email) {
      await this.verifyExistingUser(attrs.username, attrs.email);
    }

    if (attrs.passwordRecoveryToken) {
      this.validateAndCheckToken(attrs.passwordRecoveryToken);
    }

    if (attrs.password) {
      const salt = await bcrypt.genSalt(10);
      attrs.password = await bcrypt.hash(attrs.password, salt);
    }

    this.userRepository.merge(user, attrs);

    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<UpdateResult> {
    const user = await this.findOneOrFail({ where: { id } });

    return this.userRepository.softDelete(user.id);
  }

  async restore(id: string): Promise<UpdateResult> {
    const user = await this.findOneOrFail({ where: { id }, withDeleted: true });

    return this.userRepository.restore(user.id);
  }

  async verifyExistingUser(username: string, email: string): Promise<void> {
    const existingUser = await this.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException(messagesHelper.USER_EXISTS);
      }
      if (existingUser.email === email) {
        throw new ConflictException(messagesHelper.EMAIL_EXISTS);
      }
    }
  }

  async passwordRecovery(
    password: string,
    passwordRecoveryToken: string,
  ): Promise<User> {
    const isValidToken = this.validateAndCheckToken(passwordRecoveryToken);

    if (isValidToken === false) {
      throw new UnauthorizedException(messagesHelper.INVALID_TOKEN);
    }

    const decodedToken = this.jwtService.decode(passwordRecoveryToken);
    const userId = decodedToken.sub;

    const user = await this.findOneOrFail({
      where: { id: userId },
    });

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user.password = password;

    return this.userRepository.save(user);
  }

  validateAndCheckToken(token: string): boolean {
    try {
      const options = { secret: jwtConfig.passwordRecoverySecret };
      const decodedToken = this.jwtService.verify(token, options);

      // Check the expiration time
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && currentTimestamp >= decodedToken.exp) {
        // Token has expired
        return false;
      }

      // Token is valid and not expired
      return true;
    } catch (error) {
      // Token verification failed
      return false;
    }
  }
}
