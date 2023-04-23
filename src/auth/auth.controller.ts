import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetCurrentUser } from '../common/decorators/getCurrentUser.decorator';
import { GetCurrentUserId } from '../common/decorators/getCurrentUserId.decorator';
import { PublicRoute } from '../common/decorators/public.decorator';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { Tokens } from './types';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @PublicRoute()
  async createUser(@Body() body: CreateUserDto): Promise<Tokens> {
    return await this.authService.signUp(
      body.username,
      body.email,
      body.password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @PublicRoute()
  async login(@Body() body: LoginDto): Promise<Tokens> {
    return await this.authService.login(body.username, body.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@GetCurrentUserId() id: string): Promise<boolean> {
    return this.authService.logout(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(
    @GetCurrentUserId() id: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(id, refreshToken);
  }
}
