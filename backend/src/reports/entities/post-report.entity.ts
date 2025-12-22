import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { BaseReport } from './base-report.entity';
import { User } from '../../users/entities/user.entity';

@Entity('post_reports')
export class PostReport extends BaseReport {
  @ManyToOne(() => User, (user) => user.postReports, { onDelete: 'CASCADE' })
  reporter: User;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.reports, { onDelete: 'CASCADE' })
  post: Post;
}