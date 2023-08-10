import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { messagesHelper } from '../../../helpers/messages-helper';
import { passwordHelper } from '../../../helpers/password-helper';

export class UserPasswordChangeDto {
  @ApiProperty({
    description: 'The new password of the user',
    example: 'Cc!123456',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(passwordHelper.password, {
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
