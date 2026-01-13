import {
  Entity,
  Column,
  ManyToOne,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReportReason } from '../types';

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
   type: 'simple-enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;
  
  @Column({
  type: 'simple-enum',
  enum: ReportReason,
})
reason: ReportReason;

  @Column({ nullable: true })
description?: string; // user extra info
  @Column({ default: false })
  isPlatformComplaint: boolean;

    @CreateDateColumn()
  createdAt: Date;
    @UpdateDateColumn()
  updatedAt: Date;
}
