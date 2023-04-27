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

import { Note } from '../notes/note.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  // TODO implement role
  // @Column()
  // role?: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Note, (note) => note.user, { cascade: true })
  notes: Note[];

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @Column({ nullable: true })
  hashedPasswordRecoveryToken?: string;

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
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
