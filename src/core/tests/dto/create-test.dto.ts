import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { AnswerEnum } from '../enums/test.enum';
import { AnswerEntity } from '../helper/test-helper';

export class CreateTestDto {
  @ApiProperty({
    description: 'The answers of the test A',
    example: [
      { answer: AnswerEnum.NEVER },
      { answer: AnswerEnum.RARELY },
      { answer: AnswerEnum.VERY_OFTEN },
      { answer: AnswerEnum.SOMETIMES },
      { answer: AnswerEnum.RARELY },
      { answer: AnswerEnum.SOMETIMES },
    ],
  })
  @ArrayMinSize(6)
  @IsArray()
  @IsNotEmpty()
  @Type(() => AnswerEntity)
  @ValidateNested()
  test_a: AnswerEntity[];

  @ApiProperty({
    description: 'The answers of the test B',
    example: [
      { answer: AnswerEnum.NEVER },
      { answer: AnswerEnum.RARELY },
      { answer: AnswerEnum.VERY_OFTEN },
      { answer: AnswerEnum.OFTEN },
      { answer: AnswerEnum.OFTEN },
      { answer: AnswerEnum.NEVER },
      { answer: AnswerEnum.VERY_OFTEN },
      { answer: AnswerEnum.VERY_OFTEN },
      { answer: AnswerEnum.OFTEN },
      { answer: AnswerEnum.OFTEN },
      { answer: AnswerEnum.VERY_OFTEN },
      { answer: AnswerEnum.VERY_OFTEN },
    ],
  })
  @ArrayMinSize(12)
  @IsArray()
  @IsNotEmpty()
  @Type(() => AnswerEntity)
  @ValidateNested()
  test_b: AnswerEntity[];
}
