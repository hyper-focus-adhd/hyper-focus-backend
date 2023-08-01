import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    description: 'The updated content of the comment',
    example: 'Sample content',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'The updated likes and dislikes of the comment',
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
