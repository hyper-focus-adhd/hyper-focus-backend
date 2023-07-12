import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../common/decorators/current-user-id.decorator';

import { FileStorageService } from './file-storage.service';

@ApiTags('File Storage')
@Controller('api/v1/file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfilePicture(
    @UploadedFile() image: Express.Multer.File,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.fileStorageService.uploadProfilePicture(image, userId);
  }
}
