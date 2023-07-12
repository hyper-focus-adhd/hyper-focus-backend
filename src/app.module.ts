import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { AccessTokenGuard } from './common/guards/access-token.guard';
import { dataSourceOptions } from './database/data-source';
import { FileStorageModule } from './file-storage/file-storage.module';
import { MailerModule } from './mailer/mailer.module';
import { NotesModule } from './notes/notes.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

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
