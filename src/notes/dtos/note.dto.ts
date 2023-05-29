import { Expose } from 'class-transformer';

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
  user: string;
}
