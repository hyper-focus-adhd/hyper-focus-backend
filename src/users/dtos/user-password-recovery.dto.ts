import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { messagesHelper } from '../../helpers/messages-helper';
import { regexHelper } from '../../helpers/regex-helper';

export class UserPasswordRecoveryDto {
  @IsNotEmpty()
  @IsString()
  @Matches(regexHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordRecoveryToken: string;
}
