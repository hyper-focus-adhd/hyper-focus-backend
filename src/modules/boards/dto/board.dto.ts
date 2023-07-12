import { Expose } from 'class-transformer';

export class BoardDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  color: string;

  @Expose()
  user: string;
}
