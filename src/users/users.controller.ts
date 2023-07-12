import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { PublicRoute } from '../common/decorators/public.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';

import { UpdateUserDto } from './dtos/update-user.dto';
import { UserPasswordRecoveryDto } from './dtos/user-password-recovery.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('api/v1/users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findCurrentUser(@CurrentUserId() userId: string): Promise<User> {
    return await this.usersService.findOneUser({ where: { id: userId } });
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneUserOrFail({ where: { id } });
  }

  @Get('all')
  async findAllUsers(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }

  @Patch()
  async updateUser(
    @Body() body: UpdateUserDto,
    @CurrentUserId() userId: string,
  ): Promise<User> {
    return await this.usersService.updateUser(userId, body);
  }

  @Delete()
  async removeUser(@CurrentUserId() userId: string): Promise<UpdateResult> {
    return await this.usersService.removeUser(userId);
  }

  @Patch('restore')
  async restoreUser(@CurrentUserId() userId: string): Promise<UpdateResult> {
    return await this.usersService.restoreUser(userId);
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
