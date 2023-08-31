import { Expose, Transform, Type } from 'class-transformer';

import { currentTimeZone } from '../../../common/functions/timezone.function';
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

  @Transform(({ value }) => currentTimeZone(value))
  @Expose()
  created_at: Date;

  @Type(() => BoardDto)
  @Expose()
  board: BoardDto;
}
