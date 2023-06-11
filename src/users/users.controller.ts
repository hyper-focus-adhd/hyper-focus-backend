import { Storage } from '@google-cloud/storage';
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
import { GoogleCloudStorage } from '../common/decorators/google-cloud-storage.decorator';
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
  constructor(
    private readonly usersService: UsersService,
    @GoogleCloudStorage() private readonly storage: Storage,
  ) {}

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneUserOrFail({ where: { id } });
  }

  @Get()
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

  @PublicRoute()
  @Get('test')
  async testStorage(): Promise<string> {
    console.log('test');
    const bucketName = 'your-bucket-name';

    try {
      // Access the bucket and list its contents
      const bucket = this.storage.bucket(bucketName);
      const [files] = await bucket.getFiles();

      // Return the number of files in the bucket as a response
      return `Number of files in the bucket '${bucketName}': ${files.length}`;
    } catch (error) {
      // Handle any errors that occur
      console.error('Error occurred:', error);
      return 'An error occurred while accessing the storage bucket.';
    }
  }
}
