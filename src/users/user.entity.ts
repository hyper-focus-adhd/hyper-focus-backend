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

import { Gender, Language, Role } from '../enums/user.enum';
import { Note } from '../notes/note.entity';

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

  // TODO: improve date format validation
  @Column({ nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  nationality: string;

  @Column({ default: Language.ENGLISH })
  language: Language;

  @OneToMany(() => Note, (note) => note.user, { cascade: true })
  notes: Note[];

  @Column({ nullable: true })
  hashedRefreshToken: string;

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
