import { Expose } from 'class-transformer';

import { User } from '../../users/entities/user.entity';

export class PostDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  image: string;

  @Expose()
  reaction: object;

  @Expose()
  created_at: Date;

  @Expose()
  userId: User;
}
