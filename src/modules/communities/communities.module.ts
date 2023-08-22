import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { Community } from './entities/community.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Community])],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
})
export class CommunitiesModule {}
