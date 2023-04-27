import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { messagesHelper } from '../../helpers/messages-helper';
import { regExHelper } from '../../helpers/regExHelper';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Matches(regExHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password: string;
}
