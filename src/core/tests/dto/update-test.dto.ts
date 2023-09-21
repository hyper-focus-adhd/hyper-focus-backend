import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { AnswerEnum } from '../enums/test.enum';
import { AnswerEntity } from '../helper/test-helper';

import { CreateTestDto } from './create-test.dto';

export class UpdateTestDto extends PartialType(CreateTestDto) {
  @ApiProperty({
    description: 'The updated answers of the test A',
    example: {
      test_a: [
        { answer: AnswerEnum.NEVER },
        { answer: AnswerEnum.RARELY },
        { answer: AnswerEnum.VERY_OFTEN },
        { answer: AnswerEnum.SOMETIMES },
        { answer: AnswerEnum.RARELY },
        { answer: AnswerEnum.SOMETIMES },
      ],
    },
  })
  @ArrayMinSize(6)
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => AnswerEntity)
  @ValidateNested()
  test_a: AnswerEntity[];

  @ApiProperty({
    description: 'The updated answers of the test B',
    example: {
      test_b: [
        { answer: AnswerEnum.NEVER },
        { answer: AnswerEnum.RARELY },
        { answer: AnswerEnum.RARELY },
        { answer: AnswerEnum.OFTEN },
        { answer: AnswerEnum.OFTEN },
        { answer: AnswerEnum.NEVER },
        { answer: AnswerEnum.RARELY },
        { answer: AnswerEnum.RARELY },
        { answer: AnswerEnum.OFTEN },
        { answer: AnswerEnum.OFTEN },
        { answer: AnswerEnum.VERY_OFTEN },
        { answer: AnswerEnum.VERY_OFTEN },
      ],
    },
  })
  @ArrayMinSize(12)
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => AnswerEntity)
  @ValidateNested()
  test_b: AnswerEntity[];
}
