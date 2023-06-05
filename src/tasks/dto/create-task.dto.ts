import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { IsDateObject } from '../../common/decorators/date-object.decorator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsObject()
  @IsDateObject()
  date: { start: Date; end: Date };

  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  @IsDateObject()
  time: { start: Date; end: Date };
}
