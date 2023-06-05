import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  color: string;

  @IsOptional()
  @IsNotEmpty()
  @IsObject()
  placement: { x: number; y: number };
}
