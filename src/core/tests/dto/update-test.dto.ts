import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import {
  AnswerEnum,
  ResultEnum,
  TestAEnum,
  TestBEnum,
} from '../enums/test.enum';

import { CreateTestDto, QuestionEntity } from './create-test.dto';

export class UpdateTestDto extends PartialType(CreateTestDto) {
  @ApiProperty({
    description: 'The updated test A of the test',
    example: {
      test_a: [
        { question: TestAEnum.QUESTION_1, answers: AnswerEnum.NEVER },
        { question: TestAEnum.QUESTION_2, answers: AnswerEnum.RARELY },
        { question: TestAEnum.QUESTION_3, answers: AnswerEnum.VERY_OFTEN },
        { question: TestAEnum.QUESTION_4, answers: AnswerEnum.SOMETIMES },
        { question: TestAEnum.QUESTION_5, answers: AnswerEnum.RARELY },
        { question: TestAEnum.QUESTION_6, answers: AnswerEnum.SOMETIMES },
      ],
    },
  })
  @ArrayMinSize(6)
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => QuestionEntity)
  @ValidateNested()
  test_a: QuestionEntity[];

  @ApiProperty({
    description: 'The updated test B of the test',
    example: {
      test_b: [
        { question: TestBEnum.QUESTION_1, answers: AnswerEnum.NEVER },
        { question: TestBEnum.QUESTION_2, answers: AnswerEnum.RARELY },
        { question: TestBEnum.QUESTION_3, answers: AnswerEnum.RARELY },
        { question: TestBEnum.QUESTION_4, answers: AnswerEnum.OFTEN },
        { question: TestBEnum.QUESTION_5, answers: AnswerEnum.OFTEN },
        { question: TestBEnum.QUESTION_6, answers: AnswerEnum.NEVER },
        { question: TestBEnum.QUESTION_7, answers: AnswerEnum.RARELY },
        { question: TestBEnum.QUESTION_8, answers: AnswerEnum.RARELY },
        { question: TestBEnum.QUESTION_9, answers: AnswerEnum.OFTEN },
        { question: TestBEnum.QUESTION_10, answers: AnswerEnum.OFTEN },
        { question: TestBEnum.QUESTION_11, answers: AnswerEnum.VERY_OFTEN },
        { question: TestBEnum.QUESTION_12, answers: AnswerEnum.VERY_OFTEN },
      ],
    },
  })
  @ArrayMinSize(12)
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => QuestionEntity)
  @ValidateNested()
  test_b: QuestionEntity[];

  @ApiProperty({
    description: 'The updated result of the test',
    example: ResultEnum.Result_1,
  })
  @IsEnum(ResultEnum)
  @IsNotEmpty()
  @IsOptional()
  result: ResultEnum;
}
