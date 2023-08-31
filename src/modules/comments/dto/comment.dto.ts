import { Expose, Transform, Type } from 'class-transformer';

import { currentTimeZone } from '../../../common/functions/timezone.function';
import { PostDto } from '../../posts/dto/post.dto';
import { UserDto } from '../../users/dtos/user.dto';

export class CommentDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

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

  @Type(() => PostDto)
  @Expose()
  post: PostDto;

  @Type(() => CommentDto)
  @Expose()
  parentComment: CommentDto;
}
