import { Expose, Transform, Type } from 'class-transformer';

import { CategoryEnum } from '../../../common/enums/community.enum';
import { currentTimeZone } from '../../../common/functions/timezone.function';
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
  category: CategoryEnum;

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
