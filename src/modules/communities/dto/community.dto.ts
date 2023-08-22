import { Expose, Type } from 'class-transformer';

import { CategoryEnum } from '../../../common/enums/community.enum';
import { UserDto } from '../../users/dtos/user.dto';

export class CommunityDto {
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

  @Expose()
  created_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
