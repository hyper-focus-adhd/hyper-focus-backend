import { Readable } from 'stream';

import { Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { messagesHelper } from '../helpers/messages-helper';
import { UsersService } from '../users/users.service';

@Injectable()
export class FileStorageService {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: Storage,
  ) {}

  async uploadProfilePicture(
    image: Express.Multer.File,
    userId: string,
  ): Promise<{ imagePath: string }> {
    const bucketName = 'hyper-focus';
    const folderName = `users/${userId}/profile-pictures`;

    if (!image) {
      throw new BadRequestException(messagesHelper.IMAGE_FILE_EMPTY);
    }

    try {
      // Upload the image to Google Cloud Storage
      const bucket = this.storage.bucket(bucketName);
      const fileName = `${folderName}/image_${ulid()}.jpg`;
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
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      // Save the image path in the database
      await this.usersService.updateUser(userId, {
        profile_picture: publicUrl,
      });

      return { imagePath: publicUrl };
    } catch (error) {
      console.error(messagesHelper.ERROR_OCCURRED, error);
      throw new Error(messagesHelper.IMAGE_FILE_UPLOAD_ERROR);
    }
  }
}
