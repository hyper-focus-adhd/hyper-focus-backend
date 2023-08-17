import { Expose, Transform, Type } from 'class-transformer';

import { UserDto } from '../../users/dtos/user.dto';

export class CommentDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  reaction: object;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;

  @Transform(({ obj }) => obj.postId?.id)
  @Expose()
  postId: string;

  @Transform(({ obj }) => obj.parentCommentId?.id)
  @Expose()
  parentCommentId: string;
}
