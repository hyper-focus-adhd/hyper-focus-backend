import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { Reaction } from '../../common/types';
import { UpdatePostDto } from '../posts/dto/update-post.dto';
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

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiParam({ name: 'parentCommentId', required: false })
  @Post(':postId/:parentCommentId?')
  async createComment(
    @Body() body: CreateCommentDto,
    @CurrentUserId() user: User,
    @Param('postId') postId: string,
    @Param('parentCommentId') parentCommentId: string,
  ): Promise<Comment> {
    return await this.commentsService.createComment(
      user,
      postId,
      parentCommentId,
      body,
    );
  }

  @ApiOperation({ summary: 'Find all comments by post id' })
  @Get(':postId')
  async findAllCommentsByPostId(
    @Param('postId') postId: string,
  ): Promise<Comment[]> {
    return await this.commentsService.findAllCommentsByPostId(postId);
  }

  @ApiOperation({ summary: 'Find all comments by user id' })
  @Get()
  async findAllCommentsByUserId(
    @CurrentUserId() user: string,
  ): Promise<Comment[]> {
    return await this.commentsService.findAllCommentsByUserId(user);
  }

  @ApiOperation({ summary: 'Update a comment' })
  @Patch(':postId/:commentId')
  async updateComment(
    @Body() body: UpdatePostDto,
    @CurrentUserId() user: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<Comment> {
    return await this.commentsService.updateComment(
      user,
      postId,
      commentId,
      body,
    );
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @Delete(':postId/:commentId')
  async removeComment(
    @CurrentUserId() user: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<UpdateResult> {
    return await this.commentsService.removeComment(user, postId, commentId);
  }

  @ApiOperation({ summary: 'Restore a deleted comment' })
  @Patch('restore/:postId/:commentId')
  async restoreComment(
    @CurrentUserId() user: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<UpdateResult> {
    return await this.commentsService.restoreComment(user, postId, commentId);
  }

  @ApiOperation({ summary: 'React to a comment' })
  @Patch('reactions/:postId/:commentId')
  async reactionComment(
    @Body() reaction: Reaction,
    @CurrentUserId() user: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ): Promise<Comment> {
    return await this.commentsService.reactionComment(
      user,
      postId,
      commentId,
      reaction,
    );
  }
}
