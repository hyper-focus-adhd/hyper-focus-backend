import { Expose } from 'class-transformer';

export class PostDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  image: string;

  @Expose()
  reaction: object;
}
