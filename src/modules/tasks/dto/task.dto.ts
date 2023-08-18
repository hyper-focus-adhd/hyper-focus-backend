import { Expose, Type } from 'class-transformer';

import { Status } from '../../../common/enums/task.enum';
import { UserDto } from '../../users/dtos/user.dto';

export class TaskDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: Status;

  @Expose()
  date: object;

  @Expose()
  time: object;

  @Expose()
  created_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
