import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PublicRoute } from './decorators/public.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @PublicRoute()
  async createUser(@Body() body: CreateUserDto) {
    return await this.authService.signUp(
      body.username,
      body.email,
      body.password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @PublicRoute()
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body.username, body.password);
  }
}
