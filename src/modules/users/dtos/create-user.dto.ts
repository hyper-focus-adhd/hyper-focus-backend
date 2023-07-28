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

import { Gender, Language } from '../../../enums/user.enum';
import { messagesHelper } from '../../../helpers/messages-helper';
import { regexHelper } from '../../../helpers/regex-helper';

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
  @Matches(regexHelper.password, {
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
  @IsEnum(Gender)
  gender: Gender;

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
  @IsEnum(Language)
  language: Language;

  @ApiProperty({
    description: 'The profile image of the user',
    example: 'An image',
  })
  @IsOptional()
  @IsString()
  profile_image: string;

  @ApiProperty({
    description: 'The friends of the user',
    example: [
      'TGH6C5APTWQFKN46BPFFCNJ345',
      'HJU6C5APTWQFKN46BPFFCNJ555',
      'LOP6C5APTWQFKN46BPFFCNJ342',
    ],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  friends: string[];
}
