import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { reactionHelper } from '../../common/helpers/reaction-helper';
import { Reaction } from '../../common/types';
import { FileStorageService } from '../../integration/file-storage/file-storage.service';
import { CommunitiesService } from '../communities/communities.service';
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
    private readonly communitiesService: CommunitiesService,
  ) {}

  async createPost(
    user: User,
    communityId: string,
    createPostDto: CreatePostDto,
    image: Express.Multer.File,
  ): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      user: user,
    });

    const userId = JSON.parse(JSON.stringify(user));

    if (image) {
      post.image = await this.uploadPostImage(userId, post.id, image);
    }

    if (communityId) {
      post.community = JSON.parse(JSON.stringify(communityId));
    }

    const foundPost = await this.postRepository.save(post);

    return await this.findPostByPostId(foundPost.id);
  }

  async findAllPosts(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: ['user', 'community'],
    });

    if (!posts.length) {
      throw new NotFoundException(messagesHelper.POST_NOT_FOUND);
    }

    return posts;
  }

  async findAllPostsByUserId(user: string): Promise<Post[]> {
    return await this.postRepository.find({
      where: { user: { id: user } },
      relations: ['user', 'community'],
    });
  }

  async findAllPostsByCommunityId(community: string): Promise<Post[]> {
    return await this.postRepository.find({
      where: { community: { id: community } },
      relations: ['user', 'community'],
    });
  }

  async findPostByPostId(postId: string): Promise<Post> {
    return await this.findOnePostOrFail({
      where: { id: postId },
      relations: ['user', 'community'],
    });
  }

  async findAllPostsByUserName(username: string): Promise<Post[]> {
    const foundUser = await this.usersService.findOneUserOrFail({
      where: { username: username },
    });

    return this.findAllPostsByUserId(foundUser.id);
  }

  async findAllPostsByCommunityName(communityName: string): Promise<Post[]> {
    const foundCommunity = await this.communitiesService.findOneCommunityOrFail(
      {
        where: { name: communityName },
      },
    );

    return this.findAllPostsByCommunityId(foundCommunity.id);
  }

  async findAllFollowingPostsByUserId(user: string): Promise<Post[]> {
    const foundUser = await this.usersService.findOneUserOrFail({
      where: { id: user },
    });

    const followingPosts: Post[] = [];

    const userPosts = await this.findAllPostsByUserId(foundUser.id);
    followingPosts.push(...userPosts);

    for (const friend of foundUser.following) {
      const friendData = await this.usersService.findOneUserOrFail({
        where: { id: friend },
      });

      const friendPosts = await this.findAllPostsByUserId(friendData.id);

      followingPosts.push(...friendPosts);
    }

    const foundFollowingCommunities =
      await this.communitiesService.findFollowingCommunities(user);
    for (const community of foundFollowingCommunities) {
      const foundPosts = await this.postRepository.find({
        where: { community: { id: community.id } },
        relations: ['user', 'community'],
      });
      followingPosts.push(...foundPosts);
    }

    const uniqueFollowingPosts: Post[] = [];
    const uniqueIds = new Set();

    followingPosts.forEach((post) => {
      if (!uniqueIds.has(post.id)) {
        uniqueIds.add(post.id);
        uniqueFollowingPosts.push(post);
      }
    });
    return uniqueFollowingPosts;
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
      relations: ['user', 'community'],
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
