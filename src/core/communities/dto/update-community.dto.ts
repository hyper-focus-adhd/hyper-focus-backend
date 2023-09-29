import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { CategoryEnum } from '../enums/community.enum';

import { CreateCommunityDto } from './create-community.dto';

export class UpdateCommunityDto extends PartialType(CreateCommunityDto) {
  @ApiProperty({
    description: 'The updated name of the community',
    example: 'Updated name',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The updated title of the community',
    example: 'Updated title',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The updated description of the community',
    example: 'Updated description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The updated rules of the community',
    example: 'Updated rules',
  })
  @IsOptional()
  @IsString()
  rules?: string;

  @ApiProperty({
    description: 'The updated category of the community',
    example: 'Furry...',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(CategoryEnum)
  category?: CategoryEnum;

  //TODO VERIFY NOT EMPTY
  @ApiProperty({
    description: 'The updated moderators of the community',
    example: [
      'TGH6C5APTWQFKN46BPFFCNJ346',
      'HJU6C5APTWQFKN46BPFFCNJ556',
      'LOP6C5APTWQFKN46BPFFCNJ346',
    ],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  moderators?: string[];

  @ApiProperty({
    description: 'The updated followers of the community',
    example: [
      'TGH6C5APTWQFKN46BPFFCNJ342',
      'HJU6C5APTWQFKN46BPFFCNJ551',
      'LOP6C5APTWQFKN46BPFFCNJ345',
    ],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  followers?: string[];

  @ApiProperty({
    description: 'The updated banned users of the community',
    example: [
      'TGH6C5APTWQFKN46BPFFCNJ125',
      'HJU6C5APTWQFKN46BPFFCNJ673',
      'LOP6C5APTWQFKN46BPFFCNJ987',
    ],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  banned_users?: string[];
}
