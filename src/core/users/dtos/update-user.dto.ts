import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import * as moment from 'moment/moment';

import {
  GenderEnum,
  LanguageEnum,
  RoleEnum,
} from '../../../common/enums/user.enum';
import { messagesHelper } from '../../../common/helpers/messages-helper';
import { passwordHelper } from '../../../common/helpers/password-helper';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The updated username of the user',
    example: 'Brad',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'The updated role of the user',
    example: 'Admin, Doctor or User',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @ApiProperty({
    description: 'The updated email of the user',
    example: 'brad@gmail.com',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The updated password of the user',
    example: 'Bb!123456',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Matches(passwordHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password?: string;

  @ApiProperty({
    description: 'The updated birthdate of the user',
    example: 'DD-MM-YYYY or MM-DD-YYYY',
  })
  @IsOptional()
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
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @ApiProperty({
    description: 'The updated nationality of the user',
    example: 'North American',
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({
    description: 'The updated language of the user',
    example: 'English or Portuguese',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(LanguageEnum)
  language?: LanguageEnum;

  @ApiProperty({
    description: 'The updated profile image of the user',
    example: 'An image',
  })
  @IsOptional()
  @IsString()
  profile_image?: string;

  @ApiProperty({
    description: 'The updated people the user is following',
    example: ['TGH6C5APTWQFKN46BPFFCNJ345', 'LOP6C5APTWQFKN46BPFFCNJ342'],
  })
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  following?: string[];

  @ApiProperty({
    description: 'The updated followers of the user',
    example: ['TGH6C5APTWQFKN46BPFFCNJ345', 'LOP6C5APTWQFKN46BPFFCNJ342'],
  })
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  followers?: string[];

  @ApiProperty({
    description: 'The updated hashed refresh token of the user',
    example: 'A hashed refresh token',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  hashed_refresh_token?: string;
}
