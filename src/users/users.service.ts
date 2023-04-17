import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(userName: string, email: string, password: string) {
    const user = this.repo.create({ userName, email, password });

    return this.repo.save(user);
  }

  findOneBy(id: string) {
    return this.repo.findOneBy({ id });
  }

  find() {
    return this.repo.find();
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOneBy(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOneBy(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.softRemove(user);
  }

  async restore(id: string) {
    // TODO fix restore because findOneBy doesn't find deleted users. They are hidden
    const user = await this.findOneBy(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.restore(user.id);
  }
}
