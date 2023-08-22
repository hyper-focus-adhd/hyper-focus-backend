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

import { CategoryEnum } from '../../../common/enums/community.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Community {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  rules: string;

  @Column()
  category: CategoryEnum;

  @Column({ type: 'text', array: true, default: [] })
  moderators: string[];

  @Column({ type: 'text', array: true, default: [] })
  followers: string[];

  @Column({ type: 'text', array: true, default: [] })
  banned_users: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.communities, { onDelete: 'CASCADE' })
  user: User;

  constructor() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted Community with id', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated Community with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed Community with id', this.id);
  }
}
