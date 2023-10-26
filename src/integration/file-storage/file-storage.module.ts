import { Storage } from '@google-cloud/storage';
import { Module } from '@nestjs/common';

import { storageDataHelper } from '../../common/helpers/storage-data-helper';

import { FileStorageService } from './file-storage.service';

@Module({
  providers: [FileStorageService, storageDataHelper],
  exports: [Storage, FileStorageService, storageDataHelper],
})
export class FileStorageModule {}
