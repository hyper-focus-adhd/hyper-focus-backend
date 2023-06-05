import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import * as moment from 'moment';

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
  @Transform(({ value }) =>
    moment(value, ['DD-MM-YYYY', 'MM-DD-YYYY'], true).toDate(),
  )
  @IsDate({ message: messagesHelper.DATE_FORMAT })
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
