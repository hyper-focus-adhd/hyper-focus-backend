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

import { User } from '../../users/entities/user.entity';

@Entity()
export class Message {
  @PrimaryColumn()
  id: string;

  @Column()
  chat_id: string;

  @Column()
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.tests, { onDelete: 'CASCADE' })
  user: User;

  constructor() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted Message with id', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated Message with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed Message with id', this.id);
  }
}
