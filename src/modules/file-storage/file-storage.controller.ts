import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';

import { FileStorageService } from './file-storage.service';

@ApiTags('File Storage')
@Controller('api/v1/file-storage')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('profile-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @CurrentUserId() userId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.fileStorageService.uploadProfileImage(userId, image);
  }

  @Post('post-image/:postId')
  @UseInterceptors(FileInterceptor('image'))
  async uploadPostImage(
    @CurrentUserId() authorId: string,
    @Param('postId') postId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.fileStorageService.uploadPostImage(authorId, postId, image);
  }
}
