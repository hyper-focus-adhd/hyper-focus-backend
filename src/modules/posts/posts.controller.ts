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
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Reaction } from '../../common/types';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { User } from '../users/entities/user.entity';

import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

@ApiTags('Post')
@ApiSecurity('Access Token')
@Controller('api/v1/posts')
@Serialize(PostDto)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Body() body: CreatePostDto,
    @CurrentUserId() user: User,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PostEntity> {
    return await this.postsService.createPost(user, body, image);
  }

  @ApiOperation({ summary: 'Find all posts' })
  @Get('all')
  async findAllPosts(): Promise<PostEntity[]> {
    return await this.postsService.findAllPosts();
  }

  @ApiOperation({ summary: 'Find all friends posts by user id' })
  @Get('friends-posts')
  async findAllFriendsPostsByUserId(
    @CurrentUserId() userId: string,
  ): Promise<PostEntity[][]> {
    return await this.postsService.findAllFriendsPostsByUserId(userId);
  }

  @ApiOperation({ summary: 'Find all posts by user id' })
  @Get()
  async findAllPostsByUserId(
    @CurrentUserId() userId: string,
  ): Promise<PostEntity[]> {
    return await this.postsService.findAllPostsByUserId(userId);
  }

  @ApiOperation({ summary: 'Find a post by a post id' })
  @Get(':postId')
  async findPostByPostId(@Param('postId') postId: string): Promise<PostEntity> {
    return await this.postsService.findPostByPostId(postId);
  }

  @ApiOperation({ summary: 'Update a post' })
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

  @ApiOperation({ summary: 'Delete a post' })
  @Delete(':postId')
  async removePost(
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
  ): Promise<PostEntity> {
    return await this.postsService.removePost(userId, postId);
  }

  @ApiOperation({ summary: 'Restore a deleted post' })
  @Patch('restore/:postId')
  async restorePost(
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
  ): Promise<UpdateResult> {
    return await this.postsService.restorePost(userId, postId);
  }

  @ApiOperation({ summary: 'React to a post' })
  @Patch('reactions/:postId')
  async reactionPost(
    @Body() reaction: Reaction,
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
  ): Promise<PostEntity> {
    return await this.postsService.reactionPost(userId, postId, reaction);
  }
}
