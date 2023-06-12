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

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    hashedPassword?: string,
  ): Promise<User> {
    const user = await this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      birthdate: createUserDto.birthdate,
      gender: createUserDto.gender,
      nationality: createUserDto.nationality,
      language: createUserDto.language,
      profile_picture: createUserDto.profile_picture,
    });

    return await this.userRepository.save(user);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneUser(options: FindOneOptions<User>): Promise<User> {
    return await this.userRepository.findOne(options);
  }

  async findOneUserOrFail(options: FindOneOptions<User>): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.USER_NOT_FOUND);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.username || updateUserDto.email) {
      await this.verifyExistingUser(
        updateUserDto.username,
        updateUserDto.email,
      );
    }

    const user = await this.findOneUserOrFail({ where: { id } });

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    this.userRepository.merge(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async removeUser(id: string): Promise<UpdateResult> {
    const user = await this.findOneUserOrFail({ where: { id } });

    return await this.userRepository.softDelete(user.id);
  }

  async restoreUser(id: string): Promise<UpdateResult> {
    const user = await this.findOneUserOrFail({
      where: { id },
      withDeleted: true,
    });

    return await this.userRepository.restore(user.id);
  }

  async verifyExistingUser(username: string, email: string): Promise<void> {
    const existingUser = await this.findOneUser({
      where: [{ username }, { email }],
      withDeleted: true,
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
      throw new UnauthorizedException(messagesHelper.TOKEN_INVALID);
    }

    const decodedToken = this.jwtService.decode(passwordRecoveryToken);
    const userId = decodedToken.sub;

    const user = await this.findOneUserOrFail({
      where: { id: userId },
    });

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user.password = password;

    return await this.userRepository.save(user);
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
