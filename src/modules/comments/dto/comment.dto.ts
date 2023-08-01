import { Expose } from 'class-transformer';

import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

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
  userId: User;

  @Expose()
  postId: Post;

  @Expose()
  parentCommentId: string;
}
