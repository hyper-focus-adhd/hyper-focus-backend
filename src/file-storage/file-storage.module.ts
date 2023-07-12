import { Storage } from '@google-cloud/storage';
import { Module } from '@nestjs/common';

import { UsersModule } from '../modules/users/users.module';

import { FileStorageController } from './file-storage.controller';
import { FileStorageService } from './file-storage.service';

@Module({
  imports: [UsersModule],
  controllers: [FileStorageController],
  providers: [
    FileStorageService,
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
