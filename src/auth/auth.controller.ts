import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PublicRoute } from '../common/decorators/public.decorator';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { CreateUserDto } from '../users/dtos/create-user.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { CreateUserType } from './types/create-user.type';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @PublicRoute()
  async signUp(@Body() body: CreateUserDto): Promise<CreateUserType> {
    return await this.authService.signUp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @PublicRoute()
  async login(@Body() body: LoginDto): Promise<CreateUserType> {
    return await this.authService.login(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUserId() id: string): Promise<boolean> {
    return await this.authService.logout(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(
    @CurrentUserId() id: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshTokens(id, refreshToken);
  }
}
