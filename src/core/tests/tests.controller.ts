import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { User } from '../users/entities/user.entity';

import { CreateTestDto } from './dto/create-test.dto';
import { TestDto } from './dto/test.dto';
import { Test } from './entities/test.entity';
import { TestsService } from './tests.service';

@ApiTags('Test')
@ApiSecurity('Access Token')
@Controller('api/v1/tests')
@Serialize(TestDto)
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @ApiOperation({ summary: 'Create a new test' })
  @Post()
  async createTest(
    @Body() createTestDto: CreateTestDto,
    @CurrentUserId() user: User,
  ): Promise<Test> {
    return await this.testsService.createTest(user, createTestDto);
  }

  @ApiOperation({ summary: 'Find all tests by user id' })
  @Get()
  async findAllTestsByUserId(@CurrentUserId() user: string): Promise<Test[]> {
    return await this.testsService.findAllTestsByUserId(user);
  }

  @ApiOperation({ summary: 'Delete a test' })
  @Delete(':testId')
  async removeTest(
    @CurrentUserId() user: string,
    @Param('testId') testId: string,
  ): Promise<UpdateResult> {
    return await this.testsService.removeTest(user, testId);
  }

  @ApiOperation({ summary: 'Restore a deleted test' })
  @Patch('restore/:testId')
  async restoreTest(
    @CurrentUserId() user: string,
    @Param('testId') testId: string,
  ): Promise<UpdateResult> {
    return await this.testsService.restoreTest(user, testId);
  }
}
