import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseReport } from './base-report.entity';

@Entity('user_reports')
export class UserReport extends BaseReport {
  @ManyToOne(() => User, (user) => user.reportedUserReports, { onDelete: 'CASCADE' })
  reporter: User;

  @Column()
  reportedUserId: number;

  @ManyToOne(() => User, (user) => user.userReports, { onDelete: 'CASCADE' })
  reportedUser: User;
}