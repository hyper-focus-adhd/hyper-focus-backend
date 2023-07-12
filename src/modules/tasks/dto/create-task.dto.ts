import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsDateObject } from '../../../common/decorators/date-object.decorator';
import { IsTimeObject } from '../../../common/decorators/time-object.decorator';
import { Status } from '../../../enums/task.enum';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Sample title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Sample description',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The status of the task',
    example: 'To Do, In Progress or Done',
  })
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    description: 'The date of the task',
    example: '{start: DD-MM-YYYY or MM-DD-YYYY, end: DD-MM-YYYY or MM-DD-YYYY}',
  })
  @IsNotEmpty()
  @IsDateObject()
  date: { start: Date; end: Date };

  @ApiProperty({
    description: 'The time of the task',
    example: '{start: HH:mm:ss or hh:mm:ss a, end: HH:mm:ss or hh:mm:ss a}',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsTimeObject()
  time: { start: Date; end: Date };
}
