import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { User } from '../users/entities/user.entity';

import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test) private readonly testRepository: Repository<Test>,
  ) {}

  async createTest(user: User, createTestDto: CreateTestDto): Promise<Test> {
    const test = this.testRepository.create({
      ...createTestDto,
      user: user,
    });

    const foundTest = await this.testRepository.save(test);

    return this.findOneTestOrFail({
      where: { id: foundTest.id },
      relations: ['user'],
    });
  }

  async findAllTestsByUserId(user: string): Promise<Test[]> {
    const tests = await this.testRepository.find({
      where: { user: { id: user } },
      relations: ['user'],
    });

    if (!tests.length) {
      throw new NotFoundException(messagesHelper.TEST_NOT_FOUND);
    }

    return tests;
  }

  async findOneTestOrFail(options: FindOneOptions<Test>): Promise<Test> {
    try {
      return await this.testRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.TEST_NOT_FOUND);
    }
  }

  async updateTest(
    user: string,
    testId: string,
    updateTestDto: UpdateTestDto,
  ): Promise<Test> {
    const test = await this.findOneTestOrFail({
      where: { id: testId, user: { id: user } },
      relations: ['user'],
    });

    this.testRepository.merge(test, updateTestDto);

    return await this.testRepository.save(test);
  }

  async removeTest(user: string, testId: string): Promise<UpdateResult> {
    const test = await this.findOneTestOrFail({
      where: { id: testId, user: { id: user } },
    });

    return await this.testRepository.softDelete(test.id);
  }

  async restoreTest(user: string, testId: string): Promise<UpdateResult> {
    const test = await this.findOneTestOrFail({
      where: { id: testId, user: { id: user } },
      withDeleted: true,
    });

    return await this.testRepository.restore(test.id);
  }
}
