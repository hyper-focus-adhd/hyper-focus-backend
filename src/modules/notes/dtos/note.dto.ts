import { Expose } from 'class-transformer';

import { Board } from '../../boards/entities/board.entity';

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

  @Expose()
  boardId: Board;
}
