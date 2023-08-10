import { Expose, Transform } from 'class-transformer';

export class PostDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  image: string;

  @Expose()
  reaction: object;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Transform(({ obj }) => obj.userId?.id)
  @Expose()
  userId: string;
}
