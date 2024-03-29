import { Expose, Transform, Type } from 'class-transformer';

import { currentTimeZone } from '../../../common/helpers/timezone.helper';
import { UserDto } from '../../users/dtos/user.dto';

export class CommunityDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  rules: string;

  @Expose()
  category: string;

  @Expose()
  moderators: string[];

  @Expose()
  followers: string[];

  @Expose()
  banned_users: string[];

  @Transform(({ value }) => currentTimeZone(value))
  @Expose()
  created_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
