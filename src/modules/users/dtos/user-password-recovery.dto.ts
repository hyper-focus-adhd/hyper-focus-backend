import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { messagesHelper } from '../../../helpers/messages-helper';
import { regexHelper } from '../../../helpers/regex-helper';

export class UserPasswordRecoveryDto {
  @ApiProperty({
    description: 'The new password of the user',
    example: 'Cc!123456',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(regexHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password: string;

  @ApiProperty({
    description: 'The password recovery token of the user',
    example: 'A password recovery token',
  })
  @IsNotEmpty()
  @IsString()
  passwordRecoveryToken: string;
}
