import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommunityDto {
  @ApiProperty({
    description: 'The name of the community',
    example: 'Sample name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The title of the community',
    example: 'Sample title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the community',
    example: 'Sample description',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The rules of the community',
    example: 'Sample rules',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  rules: string;

  @ApiProperty({
    description: 'The category of the community',
    example: 'Sample category',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The moderators of the community',
    example: ['TGH6C5APTWQFKN46BPFFCNJ345', 'HJU6C5APTWQFKN46BPFFCNJ555', 'LOP6C5APTWQFKN46BPFFCNJ342'],
  })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @IsString({ each: true })
  moderators: string[];

  @ApiProperty({
    description: 'The followers of the community',
    example: ['TGH6C5APTWQFKN46BPFFCNJ345', 'HJU6C5APTWQFKN46BPFFCNJ555', 'LOP6C5APTWQFKN46BPFFCNJ342'],
  })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @IsString({ each: true })
  followers: string[];

  @ApiProperty({
    description: 'The banned users of the community',
    example: ['TGH6C5APTWQFKN46BPFFCNJ133', 'HJU6C5APTWQFKN46BPFFCNJ122', 'LOP6C5APTWQFKN46BPFFCNJ111'],
  })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @IsString({ each: true })
  banned_users: string[];
}
