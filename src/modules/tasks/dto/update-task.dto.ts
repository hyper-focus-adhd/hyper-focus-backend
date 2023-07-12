import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsDateObject } from '../../../common/decorators/date-object.decorator';
import { IsTimeObject } from '../../../common/decorators/time-object.decorator';
import { Status } from '../../../enums/task.enum';

import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'The updated title of the task',
    example: 'Updated title',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The updated description of the task',
    example: 'Updated description',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The updated status of the task',
    example: 'To Do, In Progress or Done',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    description: 'The updated date of the task',
    example: '{start: DD-MM-YYYY or MM-DD-YYYY, end: DD-MM-YYYY or MM-DD-YYYY}',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDateObject()
  date: { start: Date; end: Date };

  @ApiProperty({
    description: 'The updated time of the task',
    example: '{start: HH:mm:ss or hh:mm:ss a, end: HH:mm:ss or hh:mm:ss a}',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsTimeObject()
  time: { start: Date; end: Date };
}
