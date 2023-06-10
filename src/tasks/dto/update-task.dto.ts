import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsDateObject } from '../../common/decorators/date-object.decorator';
import { IsTimeObject } from '../../common/decorators/time-object.decorator';
import { Status } from '../../enums/task.enum';

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
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsNotEmpty()
  @IsDateObject()
  date: { start: Date; end: Date };

  @IsOptional()
  @IsNotEmpty()
  @IsTimeObject()
  time: { start: Date; end: Date };
}
