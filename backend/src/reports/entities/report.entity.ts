import {
  Entity,
  Column,
  ManyToOne,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum Reportable {
  POST = 'post',
  COMMENT = 'comment',
  USER="user"
}

export enum ReportStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',}

@Entity('reports')
@Index(['reportableType', 'reportableId'])
export class Report  {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  reporter: User;

  @Column()
  reporterId: number;

  // 🔥 Polymorphic target
  @Column({
    type: 'simple-enum',
    enum: Reportable,
  })
  reportableType: Reportable;

  @Column()
  reportableId: number;

  // Optional context
  @Column({ nullable: true })
  communityId?: number;

  @Column({
   type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;
  
  @Column({ default: false })
  isPlatformComplaint: boolean;

    @CreateDateColumn()
  createdAt: Date;
}
