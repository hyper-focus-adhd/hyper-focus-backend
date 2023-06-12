import { Readable } from 'stream';

import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

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

    try {
      // Upload the image to Google Cloud Storage
      const bucket = this.storage.bucket(bucketName);
      const fileName = `${folderName}/image_${ulid()}.jpg`;
      const file = bucket.file(fileName);

      // Delete all existing files in the specified folder
      await bucket.deleteFiles({
        prefix: `${folderName}/`,
      });

      // const filePath = 'src/file-storage/test.jpg';
      // // Read the file as binary data
      // const fileData = fs.readFileSync(filePath);

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
      console.error('Error occurred:', error);
      throw new Error('An error occurred while uploading the image.');
    }
  }
}
