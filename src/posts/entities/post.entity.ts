import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
import { Reaction } from '../../reactions/entities/reaction.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, user => user.posts, { nullable: false, onDelete: 'CASCADE' })
  author: User;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => Reaction, reaction => reaction.post)
reactions: Reaction[];


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
