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

import { Comment } from '../../comments/entities/comment.entity';
import { Community } from '../../communities/entities/community.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'json', default: { like: [], dislike: [] } })
  reaction: {
    like: string[];
    dislike: string[];
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @JoinColumn({ name: 'community_id' })
  @ManyToOne(() => Community, (community) => community.posts, {
    onDelete: 'CASCADE',
  })
  community: Community;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  constructor() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted Post with id', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated Post with id', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed Post with id', this.id);
  }
}
