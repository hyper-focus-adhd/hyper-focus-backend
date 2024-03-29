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

import { Board } from '../../boards/entities/board.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Community } from '../../communities/entities/community.entity';
import { Message } from '../../messages/entities/message.entity';
import { Note } from '../../notes/entities/note.entity';
import { Post } from '../../posts/entities/post.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Test } from '../../tests/entities/test.entity';
import { GenderEnum, LanguageEnum, RoleEnum } from '../enums/user.enum';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  gender: GenderEnum;

  @Column({ nullable: true })
  nationality: string;

  @Column({ default: LanguageEnum.ENGLISH })
  language: LanguageEnum;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ type: 'text', array: true, default: [] })
  following: string[];

  @Column({ type: 'text', array: true, default: [] })
  followers: string[];

  @Column({ nullable: true })
  hashed_refresh_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Board, (board) => board.user, { cascade: true })
  boards: Board[];

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  tasks: Task[];

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Note, (note) => note.user, { cascade: true })
  notes: Note[];

  @OneToMany(() => Community, (community) => community.user, { cascade: true })
  communities: Community[];

  @OneToMany(() => Test, (test) => test.user, { cascade: true })
  tests: Test[];

  @OneToMany(() => Message, (message) => message.user, { cascade: true })
  messages: Message[];

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
