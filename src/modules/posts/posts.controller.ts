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
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { Reaction } from '../../common/types';
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
  @ApiParam({ name: 'community', required: false })
  @Post(':community?')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Body() body: CreatePostDto,
    @CurrentUserId() user: User,
    @Param('community') community: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PostEntity> {
    return await this.postsService.createPost(user, community, body, image);
  }

  @ApiOperation({ summary: 'Find all posts' })
  @Get('all')
  async findAllPosts(): Promise<PostEntity[]> {
    return await this.postsService.findAllPosts();
  }

  @ApiOperation({ summary: 'Find all following posts by user id' })
  @Get('following-posts')
  async findAllFollowingPostsByUserId(
    @CurrentUserId() user: string,
  ): Promise<PostEntity[][]> {
    return await this.postsService.findAllFollowingPostsByUserId(user);
  }

  @ApiOperation({ summary: 'Find all posts by user id' })
  @Get()
  async findAllPostsByUserId(
    @CurrentUserId() user: string,
  ): Promise<PostEntity[]> {
    return await this.postsService.findAllPostsByUserId(user);
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
    @CurrentUserId() user: string,
    @Param('postId') postId: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PostEntity> {
    return await this.postsService.updatePost(user, postId, body, image);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @Delete(':postId')
  async removePost(
    @CurrentUserId() user: string,
    @Param('postId') postId: string,
  ): Promise<PostEntity> {
    return await this.postsService.removePost(user, postId);
  }

  @ApiOperation({ summary: 'Restore a deleted post' })
  @Patch('restore/:postId')
  async restorePost(
    @CurrentUserId() user: string,
    @Param('postId') postId: string,
  ): Promise<UpdateResult> {
    return await this.postsService.restorePost(user, postId);
  }

  @ApiOperation({ summary: 'React to a post' })
  @Patch('reactions/:postId')
  async reactionPost(
    @Body() reaction: Reaction,
    @CurrentUserId() user: string,
    @Param('postId') postId: string,
  ): Promise<PostEntity> {
    return await this.postsService.reactionPost(user, postId, reaction);
  }
}
