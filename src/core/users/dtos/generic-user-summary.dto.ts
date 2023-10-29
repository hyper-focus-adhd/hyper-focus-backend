import { Expose } from 'class-transformer';

export class GenericUserSummaryDto {
  @Expose()
  user_id: string;

  @Expose()
  created_at: Date;

  @Expose()
  board_count: number;

  @Expose()
  comment_count: number;

  @Expose()
  community_count: number;

  @Expose()
  message_count: number;

  @Expose()
  note_count: number;

  @Expose()
  post_count: number;

  @Expose()
  task_count: number;

  @Expose()
  test_count: number;
}
