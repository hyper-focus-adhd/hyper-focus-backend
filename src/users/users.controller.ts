import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { Serialize } from '../interceptors/serialize.interceptor';

import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('api/v1/user')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneOrFail({ where: { id } });
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UpdateResult> {
    return await this.usersService.delete(id);
  }

  @Patch('restore/:id')
  async restoreUser(@Param('id') id: string): Promise<UpdateResult> {
    return await this.usersService.restore(id);
  }
}
