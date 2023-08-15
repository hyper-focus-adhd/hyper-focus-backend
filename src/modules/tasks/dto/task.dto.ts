import { Expose, Transform } from 'class-transformer';

import { Status } from '../../../common/enums/task.enum';

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

  @Transform(({ obj }) => obj.userId?.id)
  @Expose()
  userId: string;
}
