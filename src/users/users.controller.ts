import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { PublicRoute } from '../common/decorators/public.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';

import { UpdateUserDto } from './dtos/update-user.dto';
import { UserPasswordRecoveryDto } from './dtos/user-password-recovery.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
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

  @Patch()
  async updateUser(
    @Body() body: UpdateUserDto,
    @CurrentUserId() userId: string,
  ): Promise<User> {
    return await this.usersService.update(userId, body);
  }

  @Delete()
  async deleteUser(@CurrentUserId() userId: string): Promise<UpdateResult> {
    return await this.usersService.delete(userId);
  }

  @Patch('restore')
  async restoreUser(@CurrentUserId() userId: string): Promise<UpdateResult> {
    return await this.usersService.restore(userId);
  }

  @PublicRoute()
  @Put('password-recovery')
  async passwordRecovery(@Body() body: UserPasswordRecoveryDto): Promise<User> {
    return await this.usersService.passwordRecovery(
      body.password,
      body.passwordRecoveryToken,
    );
  }
}
