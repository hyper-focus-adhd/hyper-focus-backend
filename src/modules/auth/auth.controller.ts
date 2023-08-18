import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicRoute } from '../../common/decorators/public.decorator';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserDto } from '../users/dtos/user.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { CreateUserType } from './types/create-user.type';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up' })
  @Post('signup')
  @PublicRoute()
  @Serialize(UserDto)
  @UseInterceptors(FileInterceptor('profile_image'))
  async signUp(
    @Body() body: CreateUserDto,
    @UploadedFile() profile_image: Express.Multer.File,
  ): Promise<CreateUserType> {
    return await this.authService.signUp(body, profile_image);
  }

  @ApiOperation({ summary: 'Login' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @PublicRoute()
  @Serialize(UserDto)
  async login(@Body() body: LoginDto): Promise<object> {
    return await this.authService.login(body);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiSecurity('Access Token')
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUserId() userId: string): Promise<boolean> {
    return await this.authService.logout(userId);
  }

  @ApiOperation({ summary: 'Refresh Token' })
  @ApiSecurity('Refresh Token')
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ): Promise<{
    accessToken: string;
  }> {
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
