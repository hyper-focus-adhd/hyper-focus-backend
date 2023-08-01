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
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PublicRoute } from '../../common/decorators/public.decorator';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { CreateUserDto } from '../users/dtos/create-user.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { CreateUserType } from './types/create-user.type';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @PublicRoute()
  @UseInterceptors(FileInterceptor('image'))
  async signUp(
    @Body() body: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<CreateUserType> {
    return await this.authService.signUp(body, image);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @PublicRoute()
  async login(@Body() body: LoginDto): Promise<CreateUserType> {
    return await this.authService.login(body);
  }

  @ApiSecurity('Access Token')
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUserId() userId: string): Promise<boolean> {
    return await this.authService.logout(userId);
  }

  @ApiSecurity('Refresh Token')
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(
    @CurrentUserId() userId: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
