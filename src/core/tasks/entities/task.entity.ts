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
import { StatusEnum } from '../enums/task.enum';

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  status: StatusEnum;

  @Column({ type: 'json' })
  date: { start: Date; end: Date };

  @Column({ type: 'json', nullable: true })
  time: { start: Date; end: Date };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;

  constructor() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted Task with id', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated Task with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed Task with id', this.id);
  }
}
