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

import { Note } from '../../notes/entities/note.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Board {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  color: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.boards, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Note, (note) => note.board, { cascade: true })
  notes: Note[];

  constructor() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted Board with id', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated Board with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed Board with id', this.id);
  }
}
