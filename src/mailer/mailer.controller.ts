import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PublicRoute } from '../common/decorators/public.decorator';

import { MailerService } from './mailer.service';

@ApiTags('Mailer')
@Controller('api/v1/mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('recover-username')
  @PublicRoute()
  async recoverUsername(@Body('email') email: string): Promise<void> {
    return await this.mailerService.mailUsername(email);
  }

  @Post('recover-password')
  @PublicRoute()
  async recoverPassword(@Body('email') email: string): Promise<void> {
    return await this.mailerService.mailPasswordLink(email);
  }
}
