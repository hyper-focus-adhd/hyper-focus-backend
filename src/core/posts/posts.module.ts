import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileStorageModule } from '../../integration/file-storage/file-storage.module';
import { CommunitiesModule } from '../communities/communities.module';
import { UsersModule } from '../users/users.module';

import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UsersModule,
    CommunitiesModule,
    FileStorageModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
