import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';

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

  @CreateDateColumn()
  createdAt: Date;
}
