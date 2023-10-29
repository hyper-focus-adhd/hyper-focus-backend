import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'user_summary_view_by_year',
  expression: `
SELECT user_id,
       created_at,
       SUM(board_count)     AS board_count,
       SUM(comment_count)   AS comment_count,
       SUM(community_count) AS community_count,
       SUM(message_count)   AS message_count,
       SUM(note_count)      AS note_count,
       SUM(post_count)      AS post_count,
       SUM(task_count)      AS task_count,
       SUM(test_count)      AS test_count
FROM (SELECT board.user_id                       AS user_id,
             DATE_TRUNC('year', board.created_at) AS created_at,
             COUNT(DISTINCT board.id)            AS board_count,
             0                                   AS comment_count,
             0                                   AS community_count,
             0                                   AS message_count,
             0                                   AS note_count,
             0                                   AS post_count,
             0                                   AS task_count,
             0                                   AS test_count
      FROM "user"
               LEFT JOIN board ON "user".id = board.user_id
      GROUP BY board.user_id, DATE_TRUNC('year', board.created_at)

      UNION ALL

      SELECT comment.user_id                       AS user_id,
             DATE_TRUNC('year', comment.created_at) AS created_at,
             0                                     AS board_count,
             COUNT(DISTINCT comment.id)            AS comment_count,
             0                                     AS community_count,
             0                                     AS message_count,
             0                                     AS note_count,
             0                                     AS post_count,
             0                                     AS task_count,
             0                                     AS test_count
      FROM "user"
               LEFT JOIN comment ON "user".id = comment.user_id
      GROUP BY comment.user_id, DATE_TRUNC('year', comment.created_at)

      UNION ALL

      SELECT community.user_id                       AS user_id,
             DATE_TRUNC('year', community.created_at) AS created_at,
             0                                       AS board_count,
             0                                       AS comment_count,
             COUNT(DISTINCT community.id)            AS community_count,
             0                                       AS message_count,
             0                                       AS note_count,
             0                                       AS post_count,
             0                                       AS task_count,
             0                                       AS test_count
      FROM "user"
               LEFT JOIN community ON "user".id = community.user_id
      GROUP BY community.user_id, DATE_TRUNC('year', community.created_at)

      UNION ALL

      SELECT message.user_id                       AS user_id,
             DATE_TRUNC('year', message.created_at) AS created_at,
             0                                     AS board_count,
             0                                     AS comment_count,
             0                                     AS community_count,
             0                                     AS message_count,
             0                                     AS note_count,
             0                                     AS post_count,
             0                                     AS task_count,
             0                                     AS test_count
      FROM "user"
               LEFT JOIN message ON "user".id = message.user_id
      GROUP BY message.user_id, DATE_TRUNC('year', message.created_at)

      UNION ALL

      SELECT note.user_id                       AS user_id,
             DATE_TRUNC('year', note.created_at) AS created_at,
             0                                  AS board_count,
             0                                  AS comment_count,
             0                                  AS community_count,
             0                                  AS message_count,
             COUNT(DISTINCT note.id)            AS note_count,
             0                                  AS post_count,
             0                                  AS task_count,
             0                                  AS test_count
      FROM "user"
               LEFT JOIN note ON "user".id = note.user_id
      GROUP BY note.user_id, DATE_TRUNC('year', note.created_at)

      UNION ALL

      SELECT post.user_id                       AS user_id,
             DATE_TRUNC('year', post.created_at) AS created_at,
             0                                  AS board_count,
             0                                  AS comment_count,
             0                                  AS community_count,
             0                                  AS message_count,
             0                                  AS note_count,
             COUNT(DISTINCT post.id)            AS post_count,
             0                                  AS task_count,
             0                                  AS test_count
      FROM "user"
               LEFT JOIN post ON "user".id = post.user_id
      GROUP BY post.user_id, DATE_TRUNC('year', post.created_at)

      UNION ALL

      SELECT task.user_id                       AS user_id,
             DATE_TRUNC('year', task.created_at) AS created_at,
             0                                  AS board_count,
             0                                  AS comment_count,
             0                                  AS community_count,
             0                                  AS message_count,
             0                                  AS note_count,
             0                                  AS post_count,
             COUNT(DISTINCT task.id)            AS task_count,
             0                                  AS test_count
      FROM "user"
               LEFT JOIN task ON "user".id = task.user_id
      GROUP BY task.user_id, DATE_TRUNC('year', task.created_at)

      UNION ALL

      SELECT test.user_id                       AS user_id,
             DATE_TRUNC('year', test.created_at) AS created_at,
             0                                  AS board_count,
             0                                  AS comment_count,
             0                                  AS community_count,
             0                                  AS message_count,
             0                                  AS note_count,
             0                                  AS post_count,
             0                                  AS task_count,
             COUNT(DISTINCT test.id)            AS test_count
      FROM "user"
               LEFT JOIN test ON "user".id = test.user_id
      GROUP BY test.user_id, DATE_TRUNC('year', test.created_at)) AS subquery
WHERE user_id IS NOT NULL
   OR created_at IS NOT NULL
GROUP BY user_id, created_at;
  `,
})
export class UserSummaryByYear {
  @ViewColumn()
  user_id: string;

  @ViewColumn()
  created_at: Date;

  @ViewColumn()
  board_count: number;

  @ViewColumn()
  comment_count: number;

  @ViewColumn()
  community_count: number;

  @ViewColumn()
  message_count: number;

  @ViewColumn()
  note_count: number;

  @ViewColumn()
  post_count: number;

  @ViewColumn()
  task_count: number;

  @ViewColumn()
  test_count: number;
}
