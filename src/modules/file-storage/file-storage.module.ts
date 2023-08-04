import { Storage } from '@google-cloud/storage';
import { Module } from '@nestjs/common';

import { storageDataHelper } from '../../helpers/storage-data-helper';

import { FileStorageService } from './file-storage.service';

@Module({
  providers: [FileStorageService, storageDataHelper],
  exports: [Storage],
})
export class FileStorageModule {}
