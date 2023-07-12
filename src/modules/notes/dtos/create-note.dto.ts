import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ description: 'The text of the note', example: 'Sample text' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ description: 'The color of the note', example: 'Blue' })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: 'The placement of the note',
    example: { x: 10, y: 20 },
  })
  @IsNotEmpty()
  @IsObject()
  placement: { x: number; y: number };
}
