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

  @Column()
  timestamp: number;

  @Column({ type: 'text', array: true, nullable: true })
  likes: string[];

  @Column({ type: 'text', array: true, nullable: true })
  dislikes: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (authorId) => authorId.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_Id' })
  authorId: User;

  @JoinColumn({ name: 'post_id' })
  @ManyToOne(() => Post, (postId) => postId.comments, { onDelete: 'CASCADE' })
  postId: Post;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment, {
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
