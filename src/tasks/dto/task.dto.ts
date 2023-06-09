import { Expose } from 'class-transformer';

import { Status } from '../../enums/task.enum';

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
  user: string;
}
