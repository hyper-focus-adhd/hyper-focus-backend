import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The content of the post',
    example: 'Sample content',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The image of the post',
    example: 'An image',
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'The likes and dislikes of the post',
    example:
      '{like: [ADR6C5APTWQFKN46BPFFCNJ323, 01H6C5APTWQFKN46BPFFCNJ512, UIO6C5APTWQFKN46BPFFCNJ830], dislike:[ADR6C5APTWQFKN46BPFFCNJ341]}',
  })
  @IsObject()
  @IsOptional()
  reaction: {
    like: string[];
    dislike: string[];
  };
}
