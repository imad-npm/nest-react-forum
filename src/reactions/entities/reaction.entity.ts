import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ReactionType })
  type: ReactionType;

  @ManyToOne(() => Post, post => post.reactions, { onDelete: 'CASCADE', nullable: true })
  post: Post;

  @ManyToOne(() => Comment, comment => comment.reactions, { onDelete: 'CASCADE', nullable: true })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
