import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import * as moment from 'moment';

import { messagesHelper } from '../../../common/helpers/messages-helper';
import { passwordHelper } from '../../../common/helpers/password-helper';
import { GenderEnum, LanguageEnum } from '../enums/user.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'Tom',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'tom@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Aa!123456',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(passwordHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  password: string;

  @ApiProperty({
    description: 'The birthdate of the user',
    example: 'DD-MM-YYYY or MM-DD-YYYY',
  })
  @IsOptional()
  @Transform(({ value }) =>
    moment(value, ['DD-MM-YYYY', 'MM-DD-YYYY'], true).toDate(),
  )
  @IsDate({ message: messagesHelper.DATE_FORMAT })
  birthdate: Date;

  @ApiProperty({
    description: 'The gender of the user',
    example: 'Male, Female or Other',
  })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({
    description: 'The nationality of the user',
    example: 'Brazilian',
  })
  @IsOptional()
  @IsString()
  nationality: string;

  @ApiProperty({
    description: 'The language of the user',
    example: 'English or Portuguese',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(LanguageEnum)
  language: LanguageEnum;

  @ApiProperty({
    description: 'The profile image of the user',
    example: 'An image',
  })
  @IsOptional()
  @IsString()
  profile_image: string;

  @ApiProperty({
    description: 'The people the user is following',
    example: [
      'TGH6C5APTWQFKN46BPFFCNJ345',
      'HJU6C5APTWQFKN46BPFFCNJ555',
      'LOP6C5APTWQFKN46BPFFCNJ342',
    ],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  following: string[];

  @ApiProperty({
    description: 'The followers of the user',
    example: [
      'TGH6C5APTWQFKN46BPFFCNJ342',
      'HJU6C5APTWQFKN46BPFFCNJ535',
      'LOP6C5APTWQFKN46BPFFCNJ328',
    ],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  followers: string[];
}
