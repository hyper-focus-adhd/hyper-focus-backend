import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileStorageModule } from '../../integration/file-storage/file-storage.module';
import { MailerModule } from '../../integration/mailer/mailer.module';
import { CommunitiesModule } from '../communities/communities.module';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    FileStorageModule,
    MailerModule,
    CommunitiesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
