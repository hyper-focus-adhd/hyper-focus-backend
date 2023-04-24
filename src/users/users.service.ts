import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
    const user = await this.findOneOrFail({ where: { id } });

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
}
