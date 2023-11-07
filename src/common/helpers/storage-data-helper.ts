import 'dotenv/config';
import { Storage } from '@google-cloud/storage';

export const storageDataHelper = {
  provide: Storage,
  useValue: new Storage({
    projectId: 'hyper-focus-389222',
    keyFilename: process.env.BUCKET_KEY,
  }),
};
