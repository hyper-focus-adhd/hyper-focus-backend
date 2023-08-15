import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { PublicRoute } from '../../common/decorators/public.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';

import { RecoverUserCredentialsDto } from './dtos/recover-user-credential.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserPasswordChangeDto } from './dtos/user-password-change.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('api/v1/users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Find all users' })
  @ApiSecurity('Access Token')
  @Get('all')
  async findAllUsers(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }

  @ApiOperation({ summary: 'Find current user' })
  @ApiSecurity('Access Token')
  @Get()
  async findCurrentUser(@CurrentUserId() userId: string): Promise<User> {
    return await this.usersService.findOneUser({ where: { id: userId } });
  }

  @ApiOperation({ summary: 'Find a user by id' })
  @ApiSecurity('Access Token')
  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneUserOrFail({ where: { id } });
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiSecurity('Access Token')
  @Patch()
  @UseInterceptors(FileInterceptor('image'))
  async updateUser(
    @Body() body: UpdateUserDto,
    @CurrentUserId() userId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.updateUser(userId, body, image);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiSecurity('Access Token')
  @Delete()
  async removeUser(@CurrentUserId() userId: string): Promise<User> {
    return await this.usersService.removeUser(userId);
  }

  @ApiOperation({ summary: 'Restore a deleted user' })
  @ApiSecurity('Access Token')
  @Patch('restore')
  async restoreUser(@CurrentUserId() userId: string): Promise<UpdateResult> {
    return await this.usersService.restoreUser(userId);
  }

  @ApiOperation({ summary: 'Change a lost password' })
  @PublicRoute()
  @Put('password-change')
  async passwordChange(@Body() body: UserPasswordChangeDto): Promise<User> {
    return await this.usersService.passwordChange(
      body.password,
      body.passwordRecoveryToken,
    );
  }

  @ApiOperation({ summary: 'Recover a lost username' })
  @Post('recover-username')
  @PublicRoute()
  async recoverUsername(
    @Body() body: RecoverUserCredentialsDto,
  ): Promise<void> {
    return await this.usersService.mailUsername(body.email);
  }

  @ApiOperation({ summary: 'Mail a password link' })
  @Post('mail-password-link')
  @PublicRoute()
  async mailPasswordLink(
    @Body() body: RecoverUserCredentialsDto,
  ): Promise<void> {
    return await this.usersService.mailPasswordLink(body.email);
  }

  @ApiOperation({ summary: 'Follow a user' })
  @Patch('follow/:followUserId')
  async followUser(
    @CurrentUserId() userId: string,
    @Param('followUserId') followUserId: string,
  ): Promise<User> {
    return await this.usersService.followUser(userId, followUserId);
  }
}
