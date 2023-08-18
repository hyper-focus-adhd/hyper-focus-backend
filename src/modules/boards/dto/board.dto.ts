import { Expose, Type } from 'class-transformer';

import { UserDto } from '../../users/dtos/user.dto';

export class BoardDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  color: string;

  @Expose()
  created_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
