import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { Reaction } from '../../common/types';
import { messagesHelper } from '../../helpers/messages-helper';
import { reactionHelper } from '../../helpers/reaction-helper';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}

  async createComment(
    user: User,
    post: string,
    parentComment: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const postId = JSON.parse(JSON.stringify(post));

    await this.postsService.findOnePostOrFail({
      where: { id: post },
    });

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      reaction: createCommentDto.reaction,
      userId: user,
      postId: postId,
    });

    if (parentComment) {
      comment.parentCommentId = parentComment;
    }

    return await this.commentRepository.save(comment);
  }

  async findAllCommentsByUserId(userId: string): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { userId: { id: userId } },
      relations: ['userId', 'postId', 'parentCommentId'],
    });

    if (!comments.length) {
      throw new NotFoundException(messagesHelper.COMMENT_NOT_FOUND);
    }

    return comments;
  }

  async findOneCommentOrFail(
    options: FindOneOptions<Comment>,
  ): Promise<Comment> {
    try {
      return await this.commentRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.COMMENT_NOT_FOUND);
    }
  }

  async updateComment(
    userId: string,
    postId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    await this.postsService.findOnePostOrFail({
      where: { id: postId },
    });

    const comment = await this.findOneCommentOrFail({
      where: { id: commentId, userId: { id: userId } },
      relations: ['userId', 'postId', 'parentCommentId'],
    });
    this.commentRepository.merge(comment, updateCommentDto);

    return await this.commentRepository.save(comment);
  }

  async removeComment(
    userId: string,
    postId: string,
    commentId: string,
  ): Promise<UpdateResult> {
    await this.postsService.findOnePostOrFail({
      where: { id: postId },
    });

    const comment = await this.findOneCommentOrFail({
      where: { id: commentId, userId: { id: userId } },
    });

    return await this.commentRepository.softDelete(comment.id);
  }

  async restoreComment(
    userId: string,
    postId: string,
    commentId: string,
  ): Promise<UpdateResult> {
    await this.postsService.findOnePostOrFail({
      where: { id: postId },
    });

    const comment = await this.findOneCommentOrFail({
      where: { id: commentId, userId: { id: userId } },
      withDeleted: true,
    });

    return await this.commentRepository.restore(comment.id);
  }

  async reactionComment(
    userId: string,
    postId: string,
    commentId: string,
    reaction: Reaction,
  ): Promise<Comment> {
    await this.postsService.findOnePostOrFail({
      where: { id: postId },
    });

    const comment = await this.findOneCommentOrFail({
      where: { id: commentId },
    });

    reactionHelper(
      userId,
      comment.reaction.like,
      comment.reaction.dislike,
      reaction,
    );

    return await this.commentRepository.save(comment);
  }
}
