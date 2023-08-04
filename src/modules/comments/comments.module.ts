import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { storageDataHelper } from '../../helpers/storage-data-helper';
import { FileStorageService } from '../file-storage/file-storage.service';
import { MailerService } from '../mailer/mailer.service';
import { Post } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, User])],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    PostsService,
    FileStorageService,
    storageDataHelper,
    UsersService,
    JwtService,
    MailerService,
  ],
})
export class CommentsModule {}
