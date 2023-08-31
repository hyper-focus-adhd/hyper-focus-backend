import { Expose, Transform, Type } from 'class-transformer';

import { currentTimeZone } from '../../../common/functions/timezone.function';
import { UserDto } from '../../users/dtos/user.dto';

export class BoardDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  color: string;

  @Transform(({ value }) => currentTimeZone(value))
  @Expose()
  created_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
