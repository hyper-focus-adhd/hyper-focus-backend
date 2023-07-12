import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { messagesHelper } from '../../helpers/messages-helper';
import { regexHelper } from '../../helpers/regex-helper';

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'Tom',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Aa!123456',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(regexHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password: string;
}
