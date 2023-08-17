import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { reactionHelper } from '../../common/helpers/reaction-helper';
import { Reaction } from '../../common/types';
import { FileStorageService } from '../file-storage/file-storage.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly fileStorageService: FileStorageService,
    private readonly usersService: UsersService,
  ) {}

  async createPost(
    user: User,
    createPostDto: CreatePostDto,
    image: Express.Multer.File,
  ): Promise<Post> {
    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      reaction: createPostDto.reaction,
      user: user,
    });

    const userId = JSON.parse(JSON.stringify(user));

    if (image) {
      post.image = await this.uploadPostImage(userId, post.id, image);
    }

    return await this.postRepository.save(post);
  }

  async findAllPosts(): Promise<Post[]> {
    const posts = await this.postRepository.find({ relations: ['user'] });

    if (!posts.length) {
      throw new NotFoundException(messagesHelper.POST_NOT_FOUND);
    }

    return posts;
  }

  async findAllPostsByUserId(user: string): Promise<Post[]> {
    const posts = await this.postRepository.find({
      where: { user: { id: user } },
      relations: ['user'],
    });

    if (!posts.length) {
      throw new NotFoundException(messagesHelper.POST_NOT_FOUND);
    }

    return posts;
  }

  async findPostByPostId(postId: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(messagesHelper.POST_NOT_FOUND);
    }
    return post;
  }

  async findAllFriendsPostsByUserId(user: string): Promise<Post[][]> {
    const foundUser = await this.usersService.findOneUserOrFail({
      where: { id: user },
    });

    // //TODO: must be a transaction
    const friendsPosts: Post[][] = [];
    for (const friend of foundUser.friends) {
      const friendData = await this.usersService.findOneUserOrFail({
        where: { id: friend },
      });

      const friendPosts = await this.findAllPostsByUserId(friendData.id);
      friendsPosts.push(friendPosts);
    }

    return friendsPosts;
  }

  async findOnePostOrFail(options: FindOneOptions<Post>): Promise<Post> {
    try {
      return await this.postRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.POST_NOT_FOUND);
    }
  }

  async updatePost(
    user: string,
    postId: string,
    updatePostDto: UpdatePostDto,
    image: Express.Multer.File,
  ): Promise<Post> {
    const post = await this.findOnePostOrFail({
      where: { id: postId, user: { id: user } },
      relations: ['user'],
    });

    if (image) {
      post.image = await this.uploadPostImage(user, postId, image);
    }

    if (updatePostDto.image === null) {
      await this.removePostImage(user, postId);
    }

    this.postRepository.merge(post, updatePostDto);

    return await this.postRepository.save(post);
  }

  async removePost(user: string, postId: string): Promise<Post> {
    const post = await this.findOnePostOrFail({
      where: { id: postId, user: { id: user } },
      relations: ['comments'],
    });

    return await this.postRepository.softRemove(post);
  }

  async restorePost(user: string, postId: string): Promise<UpdateResult> {
    const post = await this.findOnePostOrFail({
      where: { id: postId, user: { id: user } },
      withDeleted: true,
    });

    return await this.postRepository.restore(post.id);
  }

  async reactionPost(
    user: string,
    postId: string,
    reaction: Reaction,
  ): Promise<Post> {
    const post = await this.findOnePostOrFail({
      where: { id: postId },
    });

    reactionHelper(user, post.reaction.like, post.reaction.dislike, reaction);

    return await this.postRepository.save(post);
  }

  async uploadPostImage(
    user: string,
    postId: string,
    image: Express.Multer.File,
  ): Promise<string> {
    const folderName = `users/${user}/posts/${postId}/post-image`;

    return await this.fileStorageService.uploadImage(image, folderName);
  }

  async removePostImage(user: string, postId: string): Promise<void> {
    const folderName = `users/${user}/posts/${postId}/post-image`;

    return await this.fileStorageService.cleanBucket(folderName);
  }
}
