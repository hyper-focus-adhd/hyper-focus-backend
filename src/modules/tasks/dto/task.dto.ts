import { Expose, Transform, Type } from 'class-transformer';

import { StatusEnum } from '../../../common/enums/task.enum';
import { currentTimeZone } from '../../../common/functions/timezone.function';
import { UserDto } from '../../users/dtos/user.dto';

export class TaskDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: StatusEnum;

  @Expose()
  date: object;

  @Expose()
  time: object;

  @Transform(({ value }) => currentTimeZone(value))
  @Expose()
  created_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
