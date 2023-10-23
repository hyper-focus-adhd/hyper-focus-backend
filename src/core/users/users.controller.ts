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
import { Community } from '../communities/entities/community.entity';

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
  @Get('user-by-id/:id')
  async findUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneUserOrFail({ where: { id } });
  }

  @ApiOperation({ summary: 'Find a user by username' })
  @ApiSecurity('Access Token')
  @Get('username/:username')
  async findUserByUsername(@Param('username') username: string): Promise<User> {
    return await this.usersService.findOneUserOrFail({ where: { username } });
  }

  @ApiOperation({ summary: 'Get following users' })
  @ApiSecurity('Access Token')
  @Get('get-following')
  async getFollowing(@CurrentUserId() userId: string): Promise<User[]> {
    return this.usersService.getFollowing(userId);
  }

  @ApiOperation({ summary: 'Get followers users' })
  @ApiSecurity('Access Token')
  @Get('get-followed')
  async getFollowed(@CurrentUserId() userId: string): Promise<User[]> {
    return this.usersService.getFollowed(userId);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiSecurity('Access Token')
  @Patch()
  @UseInterceptors(FileInterceptor('profile_image'))
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUserId() userId: string,
    @UploadedFile() profile_image: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.updateUser(
      userId,
      updateUserDto,
      profile_image,
    );
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
  async passwordChange(
    @Body() userPasswordChangeDto: UserPasswordChangeDto,
  ): Promise<User> {
    return await this.usersService.passwordChange(
      userPasswordChangeDto.password,
      userPasswordChangeDto.passwordRecoveryToken,
    );
  }

  @ApiOperation({ summary: 'Recover a lost username' })
  @Post('recover-username')
  @PublicRoute()
  async recoverUsername(
    @Body() recoverUserCredentialsDto: RecoverUserCredentialsDto,
  ): Promise<void> {
    return await this.usersService.mailUsername(
      recoverUserCredentialsDto.email,
    );
  }

  @ApiOperation({ summary: 'Mail a password link' })
  @Post('mail-password-link')
  @PublicRoute()
  async mailPasswordLink(
    @Body() recoverUserCredentialsDto: RecoverUserCredentialsDto,
  ): Promise<void> {
    return await this.usersService.mailPasswordLink(
      recoverUserCredentialsDto.email,
    );
  }

  @ApiOperation({ summary: 'Follow a user' })
  @ApiSecurity('Access Token')
  @Patch('follow/user/:followUserId')
  async followUser(
    @CurrentUserId() userId: string,
    @Param('followUserId') followUserId: string,
  ): Promise<{ user: User; followed_user: User }> {
    return await this.usersService.followUser(userId, followUserId);
  }

  @ApiOperation({ summary: 'Follow a community' })
  @ApiSecurity('Access Token')
  @Patch('follow/community/:followCommunityId')
  async followCommunity(
    @CurrentUserId() userId: string,
    @Param('followCommunityId') followCommunityId: string,
  ): Promise<Community> {
    return await this.usersService.followCommunity(userId, followCommunityId);
  }
}
