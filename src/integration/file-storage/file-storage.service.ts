import { Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { ulid } from 'ulid';

import { messagesHelper } from '../../common/helpers/messages-helper';

@Injectable()
export class FileStorageService {
  bucketName = 'hyper-focus';

  private readonly storage;

  constructor() {
    this.storage = new Storage();
  }

  async uploadImage(image: Express.Multer.File, folderName: string): Promise<string> {
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
      const bucket = this.storage.bucket(this.bucketName);
      const fileName = `${folderName}/image_${ulid()}.${image.originalname.split('.').pop()}`;
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
        stream.pipe(file.createWriteStream()).on('error', reject).on('finish', resolve);
      });

      // Generate the public URL for the image
      return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    } catch (error) {
      console.error(messagesHelper.ERROR_OCCURRED, error);
      throw new Error(messagesHelper.IMAGE_FILE_UPLOAD_ERROR);
    }
  }

  async cleanBucket(folderName: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);

      await bucket.deleteFiles({
        prefix: `${folderName}/`,
      });
    } catch (error) {
      console.error(messagesHelper.ERROR_OCCURRED, error);
      throw new Error(messagesHelper.CLEAN_BUCKET_ERROR);
    }
  }
}
