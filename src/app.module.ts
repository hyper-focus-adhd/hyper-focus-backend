import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessTokenGuard } from './common/guards/access-token.guard';
import { AuthModule } from './core/auth/auth.module';
import { BoardsModule } from './core/boards/boards.module';
import { CommentsModule } from './core/comments/comments.module';
import { CommunitiesModule } from './core/communities/communities.module';
import { FileStorageModule } from './core/file-storage/file-storage.module';
import { MailerModule } from './core/mailer/mailer.module';
import { NotesModule } from './core/notes/notes.module';
import { PostsModule } from './core/posts/posts.module';
import { TasksModule } from './core/tasks/tasks.module';
import { UsersModule } from './core/users/users.module';
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    NotesModule,
    MailerModule,
    TasksModule,
    FileStorageModule,
    BoardsModule,
    PostsModule,
    CommentsModule,
    CommunitiesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
