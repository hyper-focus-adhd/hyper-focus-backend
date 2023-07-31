import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../helpers/messages-helper';
import { FileStorageService } from '../file-storage/file-storage.service';
import { User } from '../users/entities/user.entity';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Reaction } from './types';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async createPost(
    user: User,
    createPostDto: CreatePostDto,
    image: Express.Multer.File,
  ): Promise<Post> {
    const post = this.postRepository.create({
      content: createPostDto.content,
      reaction: createPostDto.reaction,
    });

    //TODO: understand why do I need to use JSON.parse(JSON.stringify(x)) and improve this part of the code
    const userId = JSON.parse(JSON.stringify(user));
    if (image) {
      post.image = await this.uploadPostImage(userId, post.id, image);
    }

    post.authorId = user;

    return await this.postRepository.save(post);
  }

  async findAllPostsByUserId(options: FindManyOptions<Post>): Promise<Post[]> {
    const posts = await this.postRepository.find(options);

    if (!posts.length) {
      throw new NotFoundException(messagesHelper.POST_NOT_FOUND);
    }

    return posts;
  }

  async findOnePostOrFail(options: FindOneOptions<Post>): Promise<Post> {
    try {
      return await this.postRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.POST_NOT_FOUND);
    }
  }

  async updatePost(
    authorId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
    image: Express.Multer.File,
  ): Promise<Post> {
    const post = await this.findOnePostOrFail({
      where: { id: postId, authorId: { id: authorId } },
    });

    if (image) {
      post.image = await this.uploadPostImage(authorId, postId, image);
    }

    this.postRepository.merge(post, updatePostDto);

    return await this.postRepository.save(post);
  }

  async removePost(authorId: string, postId: string): Promise<Post> {
    const post = await this.findOnePostOrFail({
      where: { id: postId, authorId: { id: authorId } },
      relations: ['comments'],
    });

    return await this.postRepository.softRemove(post);
  }

  async restorePost(authorId: string, postId: string): Promise<UpdateResult> {
    const post = await this.findOnePostOrFail({
      where: { id: postId, authorId: { id: authorId } },
      withDeleted: true,
    });

    return await this.postRepository.restore(post.id);
  }

  async reactionPost(
    userId: string,
    postId: string,
    reaction: Reaction,
  ): Promise<Post> {
    const post = await this.findOnePostOrFail({
      where: { id: postId },
    });

    const likeIndex = post.reaction.like.indexOf(userId);
    const dislikeIndex = post.reaction.dislike.indexOf(userId);

    if (reaction.value === true) {
      if (likeIndex === -1) {
        post.reaction.like.push(userId);
      } else {
        post.reaction.like.splice(likeIndex, 1);
      }
      if (dislikeIndex !== -1) {
        post.reaction.dislike.splice(dislikeIndex, 1);
      }
    } else if (reaction.value === false) {
      if (dislikeIndex === -1) {
        post.reaction.dislike.push(userId);
      } else {
        post.reaction.dislike.splice(dislikeIndex, 1);
      }
      if (likeIndex !== -1) {
        post.reaction.like.splice(likeIndex, 1);
      }
    }

    return await this.postRepository.save(post);
  }

  async uploadPostImage(
    authorId: string,
    postId: string,
    image: Express.Multer.File,
  ): Promise<string> {
    const folderName = `users/${authorId}/posts/${postId}/post-image`;

    return await this.fileStorageService.uploadImage(image, folderName);
  }
}
