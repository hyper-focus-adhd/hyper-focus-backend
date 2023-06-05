import { PartialType } from '@nestjs/mapped-types';
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
import * as moment from 'moment/moment';

import { Gender, Language, Role } from '../../enums/user.enum';
import { messagesHelper } from '../../helpers/messages-helper';
import { regexHelper } from '../../helpers/regex-helper';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(regexHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) =>
    moment(value, ['DD-MM-YYYY', 'MM-DD-YYYY'], true).toDate(),
  )
  @IsDate({ message: messagesHelper.DATE_FORMAT })
  birthdate?: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  hashedRefreshToken?: string;
}
