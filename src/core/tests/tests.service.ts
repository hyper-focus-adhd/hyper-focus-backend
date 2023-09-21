import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { User } from '../users/entities/user.entity';

import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';
import { numberObject, testData } from './helper/test-helper';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test) private readonly testRepository: Repository<Test>,
  ) {}

  async createTest(user: User, createTestDto: CreateTestDto): Promise<Test> {
    const foundTestData = testData(createTestDto);
    let result = false;

    let score = 0;

    let scoreA = 0;
    const myArrayA = [
      [1, 2, 3],
      [4, 5, 6],
    ];

    let scoreB = 0;
    const myArrayB = [
      [3, 6, 10, 12],
      [1, 2, 4, 5, 7, 8, 9, 11],
    ];

    for (let i = 0; i < foundTestData.test_a.length; i++) {
      score = 0;
      for (const key in numberObject) {
        if (foundTestData.test_a[i].answer === key) {
          score = numberObject[key];
        }
      }
      if (myArrayA[0].includes(i + 1)) {
        if (score > 2) {
          scoreA++;
        }
      }
      if (myArrayA[1].includes(i + 1)) {
        if (score > 3) {
          scoreA++;
        }
      }
    }
    for (let i = 0; i < foundTestData.test_b.length; i++) {
      score = 0;
      for (const key in numberObject) {
        if (foundTestData.test_b[i].answer === key) {
          score = numberObject[key];
        }
      }
      if (myArrayB[0].includes(i + 1)) {
        if (score > 2) {
          scoreB++;
        }
      }
      if (myArrayB[1].includes(i + 1)) {
        if (score > 3) {
          scoreB++;
        }
      }
    }

    if (scoreA > 3) {
      result = true;
    }

    const test = this.testRepository.create({
      test_a: foundTestData.test_a,
      test_b: foundTestData.test_b,
      result,
      score: { test_a: scoreA, test_b: scoreB },
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
