import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @ApiProperty({
    description: 'The updated text of the message',
    example: 'Updated text',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  text: string;
}
