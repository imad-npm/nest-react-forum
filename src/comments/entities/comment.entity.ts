import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { CommentReaction } from '../../reactions/entities/comment-reaction.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, user => user.comments, { nullable: false, onDelete: 'CASCADE' })
  author: User;
   // FK explicite
  @Column()
  authorId: number

  @ManyToOne(() => Comment, comment => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  replies: Comment[];

  @OneToMany(() => CommentReaction, reaction => reaction.comment)
  reactions: CommentReaction[];


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

