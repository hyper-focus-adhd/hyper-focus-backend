import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';

import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryColumn()
  id: string;

  @Column()
  content: string;

  @Column({ type: 'json', default: { like: [], dislike: [] } })
  reaction: { like: string[]; dislike: string[] };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (userId) => userId.comments, { onDelete: 'CASCADE' })
  userId: User;

  @JoinColumn({ name: 'post_id' })
  @ManyToOne(() => Post, (postId) => postId.comments, { onDelete: 'CASCADE' })
  postId: Post;

  @JoinColumn({ name: 'parent_comment_id' })
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  parentCommentId: string;

  @OneToMany(() => Comment, (comment) => comment.parentCommentId, {
    cascade: true,
  })
  replies: Comment[];

  constructor() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted Comment with id', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated Comment with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed Comment with id', this.id);
  }
}
