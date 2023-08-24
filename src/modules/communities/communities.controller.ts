import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { User } from '../users/entities/user.entity';

import { CommunitiesService } from './communities.service';
import { CommunityDto } from './dto/community.dto';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Community } from './entities/community.entity';

@ApiTags('Community')
@ApiSecurity('Access Token')
@Controller('api/v1/communities')
@Serialize(CommunityDto)
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @ApiOperation({ summary: 'Create a new community' })
  @Post()
  async createCommunity(
    @Body() body: CreateCommunityDto,
    @CurrentUserId() user: User,
  ): Promise<Community> {
    return await this.communitiesService.createCommunity(user, body);
  }

  @ApiOperation({ summary: 'Find all communities by user id' })
  @Get()
  async findAllCommunitiesByUserId(
    @CurrentUserId() user: string,
  ): Promise<Community[]> {
    return await this.communitiesService.findAllCommunitiesByUserId(user);
  }

  @ApiOperation({ summary: 'Find a community by community name' })
  @ApiSecurity('Access Token')
  @Get('community/:communityName')
  async findUserByUsername(
    @Param('communityName') communityName: string,
  ): Promise<Community> {
    return await this.communitiesService.findOneCommunityOrFail({
      where: { name: communityName },
    });
  }

  @ApiOperation({ summary: 'Update a community' })
  @Patch(':communityId')
  async updateCommunity(
    @Body() body: UpdateCommunityDto,
    @CurrentUserId() user: string,
    @Param('communityId') communityId: string,
  ): Promise<Community> {
    return await this.communitiesService.updateCommunity(
      user,
      communityId,
      body,
    );
  }

  @ApiOperation({ summary: 'Delete a community' })
  @Delete(':communityId')
  async removeCommunity(
    @CurrentUserId() user: string,
    @Param('communityId') communityId: string,
  ): Promise<UpdateResult> {
    return await this.communitiesService.removeCommunity(user, communityId);
  }

  @ApiOperation({ summary: 'Restore a deleted community' })
  @Patch('restore/:communityId')
  async restoreCommunity(
    @CurrentUserId() user: string,
    @Param('communityId') communityId: string,
  ): Promise<UpdateResult> {
    return await this.communitiesService.restoreCommunity(user, communityId);
  }
}
