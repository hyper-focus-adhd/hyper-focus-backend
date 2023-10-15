import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The id of the second user',
    example: 'Sample second user id',
  })
  @IsNotEmpty()
  @IsString()
  secondUserId: string;

  @ApiProperty({
    description: 'The text of the message',
    example: 'Sample text',
  })
  @IsNotEmpty()
  @IsString()
  text: string;
}
