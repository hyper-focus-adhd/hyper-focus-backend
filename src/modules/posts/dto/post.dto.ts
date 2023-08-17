import { Expose, Type } from 'class-transformer';

import { UserDto } from '../../users/dtos/user.dto';

export class PostDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  image: string;

  @Expose()
  reaction: object;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
