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
import { Reaction } from '../../reactions/entities/reaction.entity';
import { Community } from '../../communities/entities/community.entity';
import { ReactionType } from '../../reactions/reactions.types';
import { Report } from '../../reports/entities/report.entity';

export enum PostStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

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

  @OneToMany(() => Reaction, (reaction) => reaction.reactableId, {
    cascade: true,
  })
  reactions: Reaction[];

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  dislikesCount: number;

  @Column({ default: false })
  commentsLocked: boolean;

  @Column({
    type: 'simple-enum',
    enum: PostStatus,
    default: PostStatus.PENDING,
  })
  status: PostStatus;

@OneToMany(() => Report, (report) => report.reportableId)
reports: Report[];

  userReaction?: { id: number; type: ReactionType };
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date | null;
}
