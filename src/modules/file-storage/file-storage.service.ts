import { Readable } from 'stream';

import { Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { messagesHelper } from '../../helpers/messages-helper';

@Injectable()
export class FileStorageService {
  constructor(private readonly storage: Storage) {}

  async uploadImage(
    image: Express.Multer.File,
    folderName: string,
  ): Promise<string> {
    const bucketName = 'hyper-focus';

    if (!image) {
      throw new BadRequestException(messagesHelper.IMAGE_FILE_EMPTY);
    }

    // Perform file type verification
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    if (!allowedFileTypes.includes(image.mimetype)) {
      throw new BadRequestException(messagesHelper.IMAGE_FILE_TYPE_INVALID);
    }

    // Perform file size verification
    const maxFileSizeInBytes = 500 * 1024; // 500KB
    if (image.size > maxFileSizeInBytes) {
      throw new BadRequestException(messagesHelper.IMAGE_FILE_SIZE_ERROR);
    }

    try {
      // Upload the image to Google Cloud Storage
      const bucket = this.storage.bucket(bucketName);
      const fileName = `${folderName}/image_${ulid()}.${image.originalname
        .split('.')
        .pop()}`;
      const file = bucket.file(fileName);

      // Delete all existing files in the specified folder
      await bucket.deleteFiles({
        prefix: `${folderName}/`,
      });

      // Create a readable stream from the image buffer
      const stream = new Readable();
      stream.push(image.buffer);
      stream.push(null);

      // Upload the image file using the stream
      await new Promise((resolve, reject) => {
        stream
          .pipe(file.createWriteStream())
          .on('error', reject)
          .on('finish', resolve);
      });

      // Generate the public URL for the image
      return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    } catch (error) {
      console.error(messagesHelper.ERROR_OCCURRED, error);
      throw new Error(messagesHelper.IMAGE_FILE_UPLOAD_ERROR);
    }
  }
}