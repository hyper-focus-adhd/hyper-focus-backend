import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { messagesHelper } from '../../helpers/messages-helper';
import { regExHelper } from '../../helpers/regExHelper';

export class UserPasswordRecoveryDto {
  @IsNotEmpty()
  @IsString()
  @Matches(regExHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordRecoveryToken: string;
}
