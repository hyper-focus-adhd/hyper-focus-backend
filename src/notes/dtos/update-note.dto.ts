import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsOptional()
  @IsObject()
  placement: { x: number; y: number };
}
