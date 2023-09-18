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
import { AnswerEnum, TestAEnum, TestBEnum } from '../enums/test.enum';

export class QuestionEntity {
  question: TestAEnum | TestBEnum;
  answers: AnswerEnum[];
}

@Entity()
export class Test {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'json' })
  test_a: QuestionEntity[];

  @Column({ type: 'json' })
  test_b: QuestionEntity[];

  @Column()
  result: string;

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
    console.log('Inserted Test with id', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated Test with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed Test with id', this.id);
  }
}
