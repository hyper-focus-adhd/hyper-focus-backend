import { Storage } from '@google-cloud/storage';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { UsersModule } from '../users/users.module';

import { FileStorageController } from './file-storage.controller';
import { FileStorageService } from './file-storage.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Post])],
  controllers: [FileStorageController],
  providers: [
    FileStorageService,
    PostsService,
    {
      provide: Storage,
      useValue: new Storage({
        projectId: 'hyper-focus-389222',
        keyFilename: 'keys/hyper-focus-389222-ceb716a7a3ef.json',
      }),
    },
  ],
  exports: [Storage],
})
export class FileStorageModule {}
