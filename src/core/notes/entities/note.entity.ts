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
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';

import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Note {
  @PrimaryColumn()
  id: string;

  @Column()
  text: string;

  @Column()
  color: string;

  @Column({ type: 'json' })
  placement: {
    x: number;
    y: number;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
  user: User;

  @JoinColumn({ name: 'board_id' })
  @ManyToOne(() => Board, (board) => board.notes, { onDelete: 'CASCADE' })
  board: Board;

  constructor() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted Note with id', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated Note with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed Note with id', this.id);
  }
}
