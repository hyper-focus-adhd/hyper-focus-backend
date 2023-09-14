import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { User } from '../users/entities/user.entity';

import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Community } from './entities/community.entity';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
  ) {}

  async createCommunity(
    user: User,
    createCommunityDto: CreateCommunityDto,
  ): Promise<Community> {
    await this.verifyExistingCommunity(createCommunityDto.name);

    const community = this.communityRepository.create({
      ...createCommunityDto,
      user: user,
    });

    const foundCommunity = await this.communityRepository.save(community);

    return this.findOneCommunityOrFail({
      where: { id: foundCommunity.id },
      relations: ['user'],
    });
  }

  async findAllCommunitiesByUserId(user: string): Promise<Community[]> {
    const communities = await this.communityRepository.find({
      where: { user: { id: user } },
      relations: ['user'],
    });

    if (!communities.length) {
      throw new NotFoundException(messagesHelper.COMMUNITY_NOT_FOUND);
    }

    return communities;
  }

  async findOneCommunity(
    options: FindOneOptions<Community>,
  ): Promise<Community> {
    return await this.communityRepository.findOne(options);
  }

  async findOneCommunityOrFail(
    options: FindOneOptions<Community>,
  ): Promise<Community> {
    try {
      return await this.communityRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.COMMUNITY_NOT_FOUND);
    }
  }

  async findFollowingCommunities(userId: string): Promise<Community[]> {
    return await this.communityRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.user', 'user')
      .where(':userId = ANY(community.followers)', { userId })
      .getMany();
  }

  async updateCommunity(
    user: string,
    communityId: string,
    updateCommunityDto: UpdateCommunityDto,
  ): Promise<Community> {
    const community = await this.findOneCommunityOrFail({
      where: { id: communityId, user: { id: user } },
      relations: ['user'],
    });

    this.communityRepository.merge(community, updateCommunityDto);

    return await this.communityRepository.save(community);
  }

  async removeCommunity(
    user: string,
    communityId: string,
  ): Promise<UpdateResult> {
    const community = await this.findOneCommunityOrFail({
      where: { id: communityId, user: { id: user } },
    });

    return await this.communityRepository.softDelete(community.id);
  }

  async restoreCommunity(
    user: string,
    communityId: string,
  ): Promise<UpdateResult> {
    const community = await this.findOneCommunityOrFail({
      where: { id: communityId, user: { id: user } },
      withDeleted: true,
    });

    return await this.communityRepository.restore(community.id);
  }

  async verifyExistingCommunity(communityName: string): Promise<void> {
    const existingCommunity = await this.findOneCommunity({
      where: { name: communityName },
      withDeleted: true,
    });

    if (existingCommunity) {
      if (existingCommunity.name === communityName) {
        throw new ConflictException(messagesHelper.COMMUNITY_EXISTS);
      }
    }
  }
}
