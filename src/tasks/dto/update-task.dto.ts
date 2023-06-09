import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsDateObject } from '../../common/decorators/date-object.decorator';
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
  @IsObject()
  @IsDateObject()
  date: { start: Date; end: Date };

  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  @IsDateObject()
  time: { start: Date; end: Date };
}
