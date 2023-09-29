import { IsEnum } from 'class-validator';

import { CreateTestDto } from '../dto/create-test.dto';
import { AnswerEnum, TestAEnum, TestBEnum } from '../enums/test.enum';

export class AnswerEntity {
  @IsEnum(AnswerEnum)
  answer: AnswerEnum;
}

export type QuestionEntity = {
  question: TestAEnum | TestBEnum;
  answer: AnswerEnum;
  value: number;
};

export type Score = {
  test_a: number;
  test_b: number;
};

export type TestData = {
  test_a: QuestionEntity[];
  test_b: QuestionEntity[];
};

export const testData = (createTestDto: CreateTestDto): TestData => ({
  test_a: [
    {
      question: TestAEnum.QUESTION_1,
      answer: createTestDto.test_a[0].answer,
      value: 3,
    },
    {
      question: TestAEnum.QUESTION_2,
      answer: createTestDto.test_a[1].answer,
      value: 3,
    },
    {
      question: TestAEnum.QUESTION_3,
      answer: createTestDto.test_a[2].answer,
      value: 3,
    },
    {
      question: TestAEnum.QUESTION_4,
      answer: createTestDto.test_a[3].answer,
      value: 4,
    },
    {
      question: TestAEnum.QUESTION_5,
      answer: createTestDto.test_a[4].answer,
      value: 4,
    },
    {
      question: TestAEnum.QUESTION_6,
      answer: createTestDto.test_a[5].answer,
      value: 4,
    },
  ],
  test_b: [
    {
      question: TestBEnum.QUESTION_1,
      answer: createTestDto.test_b[0].answer,
      value: 4,
    },
    {
      question: TestBEnum.QUESTION_2,
      answer: createTestDto.test_b[1].answer,
      value: 4,
    },
    {
      question: TestBEnum.QUESTION_3,
      answer: createTestDto.test_b[2].answer,
      value: 3,
    },
    {
      question: TestBEnum.QUESTION_4,
      answer: createTestDto.test_b[3].answer,
      value: 4,
    },
    {
      question: TestBEnum.QUESTION_5,
      answer: createTestDto.test_b[4].answer,
      value: 4,
    },
    {
      question: TestBEnum.QUESTION_6,
      answer: createTestDto.test_b[5].answer,
      value: 3,
    },
    {
      question: TestBEnum.QUESTION_7,
      answer: createTestDto.test_b[6].answer,
      value: 4,
    },
    {
      question: TestBEnum.QUESTION_8,
      answer: createTestDto.test_b[7].answer,
      value: 4,
    },
    {
      question: TestBEnum.QUESTION_9,
      answer: createTestDto.test_b[8].answer,
      value: 4,
    },
    {
      question: TestBEnum.QUESTION_10,
      answer: createTestDto.test_b[9].answer,
      value: 3,
    },
    {
      question: TestBEnum.QUESTION_11,
      answer: createTestDto.test_b[10].answer,
      value: 4,
    },
    {
      question: TestBEnum.QUESTION_12,
      answer: createTestDto.test_b[11].answer,
      value: 3,
    },
  ],
});

export const numberObject: Record<string, number> = {
  Never: 1,
  Rarely: 2,
  Sometimes: 3,
  Often: 4,
  'Very Often': 5,
};
