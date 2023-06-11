import * as path from 'path';

import { Storage } from '@google-cloud/storage';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: Storage,
      useValue: new Storage({
        projectId: 'hyper-focus-389222',
        keyFilename: path.join(
          __dirname,
          '..keys/hyper-focus-389222-ceb716a7a3ef.json',
        ),
      }),
    },
  ],
  exports: [Storage],
})
export class GoogleCloudStorageModule {}
