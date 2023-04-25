import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import { messagesHelper } from '../../helpers/messages-helper';
import { RegExHelper } from '../../helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(RegExHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password: string;
}
