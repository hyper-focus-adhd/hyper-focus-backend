import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';

import { Gender, Language, Role } from '../../../enums/user.enum';
import { Board } from '../../boards/entities/board.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Post } from '../../posts/entities/post.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: Role.USER })
  role: Role;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  nationality: string;

  @Column({ default: Language.ENGLISH })
  language: Language;

  @Column({ nullable: true })
  profile_image: string;

  @Column('text', { array: true, nullable: true })
  friends: string[];

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Board, (board) => board.userId, { cascade: true })
  boards: Board[];

  @OneToMany(() => Task, (task) => task.userId, { cascade: true })
  tasks: Task[];

  @OneToMany(() => Post, (post) => post.authorId, { cascade: true })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.authorId, { cascade: true })
  comments: Comment[];

  constructor() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed User with id', this.id);
  }
}
