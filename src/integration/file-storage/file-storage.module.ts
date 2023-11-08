import { Storage } from '@google-cloud/storage';
import { Module } from '@nestjs/common';

import { FileStorageService } from './file-storage.service';

@Module({
  providers: [FileStorageService],
  exports: [Storage, FileStorageService],
})
export class FileStorageModule {}
