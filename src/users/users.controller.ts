import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';

import { Serialize } from '../interceptors/serialize.interceptor';

import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('api/v1/user')
@Serialize(UserDto)
// TODO: create custom dto to each route when implementing admin
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findUser(@Param('id') id: string) {
    return await this.usersService.findOneOrFail({ where: { id } });
  }

  @Get()
  async findAllUsers() {
    return await this.usersService.findAll();
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(id, body);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Patch('restore/:id')
  async restoreUser(@Param('id') id: string) {
    return await this.usersService.restore(id);
  }
}
