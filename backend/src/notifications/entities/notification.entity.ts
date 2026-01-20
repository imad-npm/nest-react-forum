import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NotificationType } from '../types'; // Import NotificationType

export enum NotificationResourceType {
  POST = 'Post',
  COMMENT = 'Comment',
  COMMUNITY_MEMBERSHIP_REQUEST = 'CommunityMembershipRequest',
  COMMUNITY = "COMMUNITY",
  // Add other resource types as needed
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  recipient: User;

  @ManyToOne(() => User, { nullable: true })
  actor: User;

  @Column({ type: 'simple-enum', enum: NotificationType }) // Changed to use NotificationType enum
  type: NotificationType;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'simple-enum',
    enum: NotificationResourceType,
    nullable: true,
  })
  resourceType?: NotificationResourceType;

  @Column({ nullable: true })
  resourceId?: number;
}
