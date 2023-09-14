import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @ApiProperty({
    description: 'The updated title of the board',
    example: 'Updated title',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The updated color of the board',
    example: 'Brown',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  color: string;
}
