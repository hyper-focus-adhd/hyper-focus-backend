import { Expose, Transform } from 'class-transformer';

export class NoteDto {
  @Expose()
  id: string;
  @Expose()
  text: string;
  @Expose()
  color: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: string;
}
