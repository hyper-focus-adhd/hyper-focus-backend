import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    description: 'The title of the board',
    example: 'Sample title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The color of the board',
    example: 'Purple',
  })
  @IsNotEmpty()
  @IsString()
  color: string;
}
