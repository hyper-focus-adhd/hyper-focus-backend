import { Expose, Type } from 'class-transformer';

import { PostDto } from '../../posts/dto/post.dto';
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

  @Type(() => PostDto)
  @Expose()
  post: PostDto;

  @Type(() => CommentDto)
  @Expose()
  parentComment: CommentDto;
}
