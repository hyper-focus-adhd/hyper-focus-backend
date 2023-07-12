import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
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

import { Gender, Language, Role } from '../../../enums/user.enum';
import { messagesHelper } from '../../../helpers/messages-helper';
import { regexHelper } from '../../../helpers/regex-helper';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The updated username of the user',
    example: 'Brad',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'The updated role of the user',
    example: 'Admin, Doctor or User',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    description: 'The updated email of the user',
    example: 'brad@gmail.com',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The updated password of the user',
    example: 'Bb!123456',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(regexHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password?: string;

  @ApiProperty({
    description: 'The updated birthdate of the user',
    example: 'DD-MM-YYYY or MM-DD-YYYY',
  })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) =>
    moment(value, ['DD-MM-YYYY', 'MM-DD-YYYY'], true).toDate(),
  )
  @IsDate({ message: messagesHelper.DATE_FORMAT })
  birthdate?: Date;

  @ApiProperty({
    description: 'The updated gender of the user',
    example: 'Male, Female or Other',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    description: 'The updated nationality of the user',
    example: 'North American',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  nationality?: string;

  @ApiProperty({
    description: 'The updated language of the user',
    example: 'English or Portuguese',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Language)
  language?: Language;

  @ApiProperty({
    description: 'The updated profile picture of the user',
    example: 'A picture',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  profile_picture?: string;

  @ApiProperty({
    description: 'The updated hashed refresh token of the user',
    example: 'A hashed refresh token',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  hashedRefreshToken?: string;
}
