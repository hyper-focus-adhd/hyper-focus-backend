import { Expose } from 'class-transformer';

import { User } from '../../users/entities/user.entity';

export class BoardDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  color: string;

  @Expose()
  created_at: Date;

  @Expose()
  userId: User;
}
