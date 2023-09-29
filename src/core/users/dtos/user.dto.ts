import { Expose, Transform, Type } from 'class-transformer';

import { currentTimeZone } from '../../../common/helpers/timezone.helper';
import { GenderEnum, LanguageEnum, RoleEnum } from '../enums/user.enum';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  role: RoleEnum;

  @Expose()
  email: string;

  @Expose()
  birthdate: Date;

  @Expose()
  gender: GenderEnum;

  @Expose()
  nationality: string;

  @Expose()
  language: LanguageEnum;

  @Expose()
  profile_image: string;

  @Expose()
  following: string[];

  @Expose()
  followers: string[];

  @Transform(({ value }) => currentTimeZone(value))
  @Expose()
  created_at: Date;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;

  @Type(() => UserDto)
  @Expose()
  followed_user: UserDto;
}
