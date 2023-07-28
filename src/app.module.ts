import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessTokenGuard } from './common/guards/access-token.guard';
import { dataSourceOptions } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { BoardsModule } from './modules/boards/boards.module';
import { CommentsModule } from './modules/comments/comments.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { NotesModule } from './modules/notes/notes.module';
import { PostsModule } from './modules/posts/posts.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';

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
