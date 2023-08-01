import { Storage } from '@google-cloud/storage';

export const storageData = {
  provide: Storage,
  useValue: new Storage({
    projectId: 'hyper-focus-389222',
    keyFilename: 'keys/hyper-focus-389222-ceb716a7a3ef.json',
  }),
};
