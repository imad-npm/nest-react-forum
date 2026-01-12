import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { Reaction } from '../../reactions/entities/reaction.entity';
import { ReactionType } from 'src/reactions/reactions.types';
import { CommentReport } from '../../reports/entities/comment-report.entity';

@Entity('comments')
@Check(`id <> parentId`) export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;
 // FK explicite
  @Column()
  postId: number;
  
  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: User;
  // FK explicite
  @Column()
  authorId: number;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: Comment;

 @Column({nullable :true})
  parentId: number;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.reactableId, {
    cascade: true,
  })
  reactions: Reaction[];

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  dislikesCount: number;

  @Column({ default: 0 })
  repliesCount: number;

  @OneToMany(() => CommentReport, (commentReport) => commentReport.comment)
  reports: CommentReport[];

  userReaction?: { id: number; type: ReactionType };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
