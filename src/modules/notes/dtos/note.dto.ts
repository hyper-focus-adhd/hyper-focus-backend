import { Expose, Transform } from 'class-transformer';

export class NoteDto {
  @Expose()
  id: string;

  @Expose()
  text: string;

  @Expose()
  color: string;

  @Expose()
  placement: object;

  @Expose()
  created_at: Date;

  @Transform(({ obj }) => obj.boardId?.id)
  @Expose()
  boardId: string;
}
