import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
import { PostReaction } from '../../reactions/entities/post-reaction.entity';
import { Community } from '../../communities/entities/community.entity';
import { ReactionType } from 'src/reactions/reactions.types';
import { PostReport } from '../../reports/entities/post-report.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: User;
  // FK explicite
  @Column()
  authorId: number;

  @ManyToOne(() => Community, (community) => community.posts, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  community: Community;

  @Column({ nullable: false })
  communityId: number;

  @Column({ default: 0 })
  commentsCount: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => PostReaction, (reaction) => reaction.post)
  reactions: PostReaction[];

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  dislikesCount: number;

  @Column({ default: false })
  commentsLocked: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ type: 'datetime', nullable: true })
  approvedAt: Date | null;

  @OneToMany(() => PostReport, (postReport) => postReport.post)
  reports: PostReport[];

  userReaction?: { id: number; type: ReactionType };
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
