import { Expose, Transform } from 'class-transformer';

export class BoardDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  color: string;

  @Expose()
  created_at: Date;

  @Transform(({ obj }) => obj.userId?.id)
  @Expose()
  userId: string;
}
