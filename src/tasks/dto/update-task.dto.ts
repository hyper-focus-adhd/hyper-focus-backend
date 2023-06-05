import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { IsDateObject } from '../../common/decorators/date-object.decorator';

import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
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
