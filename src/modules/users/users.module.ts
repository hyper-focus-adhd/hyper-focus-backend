import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { storageData } from '../../helpers/storage-data-helper';
import { FileStorageService } from '../file-storage/file-storage.service';
import { MailerService } from '../mailer/mailer.service';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService, FileStorageService, storageData, MailerService],
  exports: [UsersService],
})
export class UsersModule {}
