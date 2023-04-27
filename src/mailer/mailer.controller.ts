import { Body, Controller, Get, Post } from '@nestjs/common';

import { PublicRoute } from '../common/decorators/public.decorator';

import { MailerService } from './mailer.service';

@Controller('api/v1/mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Get('username-recovery')
  @PublicRoute()
  async usernameRecovery(@Body('email') email: string) {
    return await this.mailerService.mailUsername(email);
  }

  @Post('password-recovery')
  @PublicRoute()
  async passwordRecovery(@Body('email') email: string) {
    return await this.mailerService.mailPasswordLink(email);
  }
}
