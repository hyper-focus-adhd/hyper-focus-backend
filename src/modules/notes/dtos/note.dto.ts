import { Expose, Type } from 'class-transformer';

import { BoardDto } from '../../boards/dto/board.dto';

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

  @Type(() => BoardDto)
  @Expose()
  board: BoardDto;
}
