import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  color: string;
}
