import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Reaction } from '../../common/types';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UpdatePostDto } from '../posts/dto/update-post.dto';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@ApiTags('Comment')
@ApiSecurity('Access Token')
@Controller('api/v1/comments')
@Serialize(CommentDto)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId/:parentCommentId?')
  async createComment(
    @Body() body: CreateCommentDto,
    @CurrentUserId() user: User,
    @Param('postId') postId: PostEntity,
    @Param('parentCommentId') parentCommentId: string,
  ): Promise<Comment> {
    return await this.commentsService.createComment(
      user,
      postId,
      parentCommentId,
      body,
    );
  }

  @Get()
  async findAllCommentsByUserId(
    @CurrentUserId() userId: string,
  ): Promise<Comment[]> {
    return await this.commentsService.findAllCommentsByUserId({
      where: { userId: { id: userId } },
    });
  }

  @Patch(':postId/:commentId')
  async updateComment(
    @Body() body: UpdatePostDto,
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<Comment> {
    return await this.commentsService.updateComment(
      userId,
      postId,
      commentId,
      body,
    );
  }

  @Delete(':postId/:commentId')
  async removeComment(
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<UpdateResult> {
    return await this.commentsService.removeComment(userId, postId, commentId);
  }

  @Patch('restore/:postId/:commentId')
  async restoreComment(
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<UpdateResult> {
    return await this.commentsService.restoreComment(userId, postId, commentId);
  }

  @Patch('reactions/:postId/:commentId')
  async reactionComment(
    @Body() reaction: Reaction,
    @CurrentUserId() userId: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<Comment> {
    return await this.commentsService.reactionComment(
      userId,
      postId,
      commentId,
      reaction,
    );
  }
}
