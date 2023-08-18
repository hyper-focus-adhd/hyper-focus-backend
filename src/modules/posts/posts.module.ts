import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { storageDataHelper } from '../../common/helpers/storage-data-helper';
import { FileStorageService } from '../file-storage/file-storage.service';
import { MailerService } from '../mailer/mailer.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  controllers: [PostsController],
  providers: [
    PostsService,
    FileStorageService,
    storageDataHelper,
    UsersService,
    JwtService,
    MailerService,
  ],
})
export class PostsModule {}
