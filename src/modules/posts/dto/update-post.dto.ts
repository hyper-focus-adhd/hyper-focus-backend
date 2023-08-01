import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'The updated content of the post',
    example: 'Sample content',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'The updated image of the post',
    example: 'An image',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'The updated likes and dislikes of the post',
    example:
      '{like: [UIO6C5APTWQFKN46BPFFCNJ830], dislike:[ADR6C5APTWQFKN46BPFFCNJ341]}',
  })
  @IsNotEmpty()
  @IsObject()
  @IsOptional()
  reaction?: {
    like: string[];
    dislike: string[];
  };
}
