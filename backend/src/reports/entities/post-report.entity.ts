import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { BaseReport } from './base-report.entity';
import { User } from '../../users/entities/user.entity'; // User import not needed here as reporter is inherited

@Entity('post_reports')
export class PostReport extends BaseReport {

 @ManyToOne(() => User, (user) => user.postReports, { onDelete: 'CASCADE' })
  reporter: User;

  @Column()
  postId: number;


  @Column()
  communityId: number;

  @ManyToOne(() => Post, (post) => post.reports, { onDelete: 'CASCADE' })
  post: Post;

  @Column({ default: false })
  isPlatformComplaint: boolean;
}