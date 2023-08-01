import { Storage } from '@google-cloud/storage';
import { Module } from '@nestjs/common';

import { storageData } from '../../helpers/storage-data-helper';

import { FileStorageService } from './file-storage.service';

@Module({
  providers: [FileStorageService, storageData],
  exports: [Storage],
})
export class FileStorageModule {}
