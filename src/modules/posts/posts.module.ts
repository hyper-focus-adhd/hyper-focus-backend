import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { storageData } from '../../helpers/storage-data-helper';
import { FileStorageService } from '../file-storage/file-storage.service';

import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService, FileStorageService, storageData],
})
export class PostsModule {}
