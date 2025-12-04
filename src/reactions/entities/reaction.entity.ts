import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

@Column({
  type: 'simple-enum',
  enum: ReactionType,
})
type: ReactionType;

  @ManyToOne(() => Post, { nullable: true })
  post?: Post | null;

  @ManyToOne(() => Comment, { nullable: true })
  comment?: Comment | null;

  @ManyToOne(() => User, user => user.reactions, { nullable: false, onDelete: 'CASCADE' })
  user: User; // <-- ADD THIS FIELD

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
