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
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('json')
  date: { start: Date; end: Date };

  @Column('json', { nullable: true })
  time: { start: Date; end: Date };

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.notes)
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

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
