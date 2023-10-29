import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { reactionHelper } from '../../common/helpers/reaction-helper';
import { Reaction } from '../../common/types';
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
      ...createCommentDto,
      user: user,
      post: postId,
    });

    if (parentComment) {
      comment.parentComment = parentComment;
    }

    const foundComment = await this.commentRepository.save(comment);

    return this.findOneCommentOrFail({
      where: { id: foundComment.id },
      relations: ['user', 'post', 'parentComment'],
    });
  }

  async findAllCommentsByPostId(post: string): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { post: { id: post } },
      relations: ['user', 'post', 'parentComment'],
    });

    if (!comments.length) {
      throw new NotFoundException(messagesHelper.COMMENT_NOT_FOUND);
    }

    return comments;
  }

  async findAllCommentsByUserId(user: string): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      where: { user: { id: user } },
      relations: ['user', 'post', 'parentComment'],
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
    user: string,
    post: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    await this.postsService.findOnePostOrFail({
      where: { id: post },
    });

    const comment = await this.findOneCommentOrFail({
      where: { id: commentId, user: { id: user }, post: { id: post } },
      relations: ['user', 'post', 'parentComment'],
    });
    this.commentRepository.merge(comment, updateCommentDto);

    return await this.commentRepository.save(comment);
  }

  async removeComment(
    user: string,
    post: string,
    commentId: string,
  ): Promise<UpdateResult> {
    await this.postsService.findOnePostOrFail({
      where: { id: post },
    });

    const comment = await this.findOneCommentOrFail({
      where: { id: commentId, user: { id: user }, post: { id: post } },
    });

    return await this.commentRepository.softDelete(comment.id);
  }

  async restoreComment(
    user: string,
    post: string,
    commentId: string,
  ): Promise<UpdateResult> {
    await this.postsService.findOnePostOrFail({
      where: { id: post },
    });

    const comment = await this.findOneCommentOrFail({
      where: { id: commentId, user: { id: user }, post: { id: post } },
      withDeleted: true,
    });

    return await this.commentRepository.restore(comment.id);
  }

  async reactionComment(
    user: string,
    post: string,
    commentId: string,
    reaction: Reaction,
  ): Promise<Comment> {
    await this.postsService.findOnePostOrFail({
      where: { id: post },
    });

    const comment = await this.findOneCommentOrFail({
      where: { id: commentId, user: { id: user }, post: { id: post } },
    });

    reactionHelper(
      user,
      comment.reaction.like,
      comment.reaction.dislike,
      reaction,
    );

    return await this.commentRepository.save(comment);
  }
}
