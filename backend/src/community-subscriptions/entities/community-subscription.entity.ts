import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { CommunitySubscriptionStatus } from '../types';

@Entity('community_subscriptions')
export class CommunitySubscription {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  communityId: number;

  @ManyToOne(() => User, (user) => user.communitySubscriptions)
  user: User;

  @ManyToOne(() => Community, (community) => community.subscriptions)
  community: Community;

  @Column({ type: "simple-enum", enum:CommunitySubscriptionStatus, default: CommunitySubscriptionStatus.PENDING })
  status: CommunitySubscriptionStatus;

  @CreateDateColumn()
  createdAt: Date;
}
