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
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { PublicRoute } from '../../common/decorators/public.decorator';
import { Serialize } from '../../interceptors/serialize.interceptor';

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

  @ApiSecurity('Access Token')
  @Get()
  async findCurrentUser(@CurrentUserId() userId: string): Promise<User> {
    return await this.usersService.findOneUser({ where: { id: userId } });
  }

  @ApiSecurity('Access Token')
  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneUserOrFail({ where: { id } });
  }

  @ApiSecurity('Access Token')
  @Get('all')
  async findAllUsers(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }

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

  @ApiSecurity('Access Token')
  @Delete()
  async removeUser(@CurrentUserId() userId: string): Promise<User> {
    return await this.usersService.removeUser(userId);
  }

  @ApiSecurity('Access Token')
  @Patch('restore')
  async restoreUser(@CurrentUserId() userId: string): Promise<UpdateResult> {
    return await this.usersService.restoreUser(userId);
  }

  @PublicRoute()
  @Put('password-change')
  async passwordRecovery(@Body() body: UserPasswordChangeDto): Promise<User> {
    return await this.usersService.passwordRecovery(
      body.password,
      body.passwordRecoveryToken,
    );
  }

  @Post('recover-username')
  @PublicRoute()
  async recoverUsername(
    @Body() body: RecoverUserCredentialsDto,
  ): Promise<void> {
    return await this.usersService.mailUsername(body.email);
  }

  @Post('recover-password')
  @PublicRoute()
  async recoverPassword(
    @Body() body: RecoverUserCredentialsDto,
  ): Promise<void> {
    return await this.usersService.mailPasswordLink(body.email);
  }
}
