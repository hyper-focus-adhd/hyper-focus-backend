import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsEnumInTwoEnums } from '../../../common/decorators/double-enums.decorator';
import { AnswerEnum, TestAEnum, TestBEnum } from '../enums/test.enum';

export class QuestionEntity {
  @IsEnumInTwoEnums(TestAEnum, TestBEnum)
  question: TestAEnum | TestBEnum;
  @IsEnum(AnswerEnum)
  answers: AnswerEnum;
}

export class CreateTestDto {
  @ApiProperty({
    description: 'The test A of the test',
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
  @Type(() => QuestionEntity)
  @ValidateNested()
  test_a: QuestionEntity[];

  @ApiProperty({
    description: 'The test B of the test',
    example: {
      test_b: [
        { question: TestBEnum.QUESTION_1, answers: AnswerEnum.NEVER },
        { question: TestBEnum.QUESTION_2, answers: AnswerEnum.RARELY },
        { question: TestBEnum.QUESTION_3, answers: AnswerEnum.VERY_OFTEN },
        { question: TestBEnum.QUESTION_4, answers: AnswerEnum.OFTEN },
        { question: TestBEnum.QUESTION_5, answers: AnswerEnum.OFTEN },
        { question: TestBEnum.QUESTION_6, answers: AnswerEnum.NEVER },
        { question: TestBEnum.QUESTION_7, answers: AnswerEnum.VERY_OFTEN },
        { question: TestBEnum.QUESTION_8, answers: AnswerEnum.VERY_OFTEN },
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
  @Type(() => QuestionEntity)
  @ValidateNested()
  test_b: QuestionEntity[];

  @ApiProperty({
    description: 'The result of the test',
    example: 'Sample result',
  })
  @IsNotEmpty()
  @IsString()
  result: string;
}
