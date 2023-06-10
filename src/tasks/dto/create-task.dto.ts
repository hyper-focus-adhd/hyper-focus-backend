import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsDateObject } from '../../common/decorators/date-object.decorator';
import { IsTimeObject } from '../../common/decorators/time-object.decorator';
import { Status } from '../../enums/task.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  @IsDateObject()
  date: { start: Date; end: Date };

  @IsOptional()
  @IsNotEmpty()
  @IsTimeObject()
  time: { start: Date; end: Date };
}
