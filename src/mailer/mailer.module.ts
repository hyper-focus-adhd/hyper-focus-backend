import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [MailerController],
  providers: [MailerService, UsersService],
  exports: [MailerService],
})
export class MailerModule {}
