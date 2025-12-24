import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { BaseReport } from './base-report.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comment_reports')
export class CommentReport extends BaseReport {
  @ManyToOne(() => User, (user) => user.commentReports, { onDelete: 'CASCADE' })
  reporter: User;

  @Column()
  commentId: number;

    @Column()
  communityId: number;

  @ManyToOne(() => Comment, (comment) => comment.reports, { onDelete: 'CASCADE' })
  comment: Comment;

  @Column({ default: false })
  isPlatformComplaint: boolean;
}