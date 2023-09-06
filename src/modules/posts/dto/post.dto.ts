import { Expose, Transform, Type } from 'class-transformer';

import { currentTimeZone } from '../../../common/helpers/timezone.helper';
import { CommunityDto } from '../../communities/dto/community.dto';
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

  @Transform(({ value }) => currentTimeZone(value))
  @Expose()
  created_at: Date;

  @Transform(({ value }) => currentTimeZone(value))
  @Expose()
  updated_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;

  @Type(() => CommunityDto)
  @Expose()
  community: CommunityDto;
}
