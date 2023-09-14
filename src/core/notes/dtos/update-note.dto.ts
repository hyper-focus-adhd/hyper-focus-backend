import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiProperty({
    description: 'The updated text of the note',
    example: 'Updated text',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ description: 'The updated color of the note', example: 'Red' })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  color: string;

  @ApiProperty({
    description: 'The updated placement of the note',
    example: { x: 15, y: 25 },
  })
  @IsNotEmpty()
  @IsOptional()
  @IsObject()
  placement: { x: number; y: number };
}
