import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessTokenGuard } from './common/guards/access-token.guard';
import { AuthModule } from './core/auth/auth.module';
import { BoardsModule } from './core/boards/boards.module';
import { CommentsModule } from './core/comments/comments.module';
import { CommunitiesModule } from './core/communities/communities.module';
import { MessagesModule } from './core/messages/messages.module';
import { NotesModule } from './core/notes/notes.module';
import { PostsModule } from './core/posts/posts.module';
import { TasksModule } from './core/tasks/tasks.module';
import { TestsModule } from './core/tests/tests.module';
import { UsersModule } from './core/users/users.module';
import { dataSourceOptions } from './database/data-source';
import { FileStorageModule } from './integration/file-storage/file-storage.module';
import { MailerModule } from './integration/mailer/mailer.module';

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
    TestsModule,
    MessagesModule,
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
