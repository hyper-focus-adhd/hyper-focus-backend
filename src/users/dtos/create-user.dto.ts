import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { IsCustomDate } from '../../common/decorators/date.decorator';
import { Gender, Language } from '../../enums/user.enum';
import { messagesHelper } from '../../helpers/messages-helper';
import { regexHelper } from '../../helpers/regex-helper';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(regexHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsCustomDate()
  birthdate: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Language)
  language: Language;
}
