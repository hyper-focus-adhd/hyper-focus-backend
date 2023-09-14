import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { messagesHelper } from '../../../common/helpers/messages-helper';
import { passwordHelper } from '../../../common/helpers/password-helper';

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
  @Matches(passwordHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password: string;
}
