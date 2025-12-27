import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { CommunityMembershipRole } from '../types';

@Entity('community_memberships')
export class CommunityMembership {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  communityId: number;

  @ManyToOne(() => User, (user) => user.communityMemberships)
  user: User;

  @ManyToOne(() => Community, (community) => community.memberships)
  community: Community;

  @Column({
    type: 'simple-enum',
    enum: CommunityMembershipRole,
    default: CommunityMembershipRole.MEMBER,
  })
  role: CommunityMembershipRole;

  @Column({ type: 'integer', nullable: true })
  rank: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
