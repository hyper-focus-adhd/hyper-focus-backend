import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { User } from '../users/entities/user.entity';

import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';
import { Reaction } from './types';

@ApiTags('Post')
@ApiSecurity('Access Token')
@Controller('api/v1/posts')
@Serialize(PostDto)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Body() body: CreatePostDto,
    @CurrentUserId() user: User,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PostEntity> {
    return await this.postsService.createPost(user, body, image);
  }

  @Get()
  async findAllPostsByUserId(
    @CurrentUserId() userId: string,
  ): Promise<PostEntity[]> {
    return await this.postsService.findAllPostsByUserId({
      where: { authorId: { id: userId } },
    });
  }

  @Patch(':postId')
  @UseInterceptors(FileInterceptor('image'))
  async updatePost(
    @Body() body: UpdatePostDto,
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PostEntity> {
    return await this.postsService.updatePost(userId, postId, body, image);
  }

  @Delete(':postId')
  async removePost(
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
  ): Promise<PostEntity> {
    return await this.postsService.removePost(userId, postId);
  }

  @Patch('restore/:postId')
  async restorePost(
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
  ): Promise<UpdateResult> {
    return await this.postsService.restorePost(userId, postId);
  }

  @Patch('reactions/:postId')
  async reactionPost(
    @Body() reaction: Reaction,
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
  ): Promise<PostEntity> {
    return await this.postsService.reactionPost(userId, postId, reaction);
  }

  @Post('post-image/:postId')
  @UseInterceptors(FileInterceptor('image'))
  async uploadPostImage(
    @CurrentUserId() authorId: string,
    @Param('postId') postId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<void> {
    await this.postsService.uploadPostImage(authorId, postId, image);
  }
}
