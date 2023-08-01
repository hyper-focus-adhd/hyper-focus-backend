import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { storageData } from '../../helpers/storage-data-helper';
import { FileStorageService } from '../file-storage/file-storage.service';
import { Post } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  controllers: [CommentsController],
  providers: [CommentsService, PostsService, FileStorageService, storageData],
})
export class CommentsModule {}
