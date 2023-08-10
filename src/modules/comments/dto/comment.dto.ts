import { Expose, Transform } from 'class-transformer';

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

  @Transform(({ obj }) => obj.userId?.id)
  @Expose()
  userId: string;

  @Transform(({ obj }) => obj.postId?.id)
  @Expose()
  postId: string;

  @Transform(({ obj }) => obj.parentCommentId?.id)
  @Expose()
  parentCommentId: string;
}
