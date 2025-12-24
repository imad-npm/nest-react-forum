import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';

export enum CommunityMembershipRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('community_membership_requests')
export class CommunityMembershipRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.communityMembershipRequests)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(
    () => Community,
    (community) => community.membershipRequests,
  )
  community: Community;

  @Column()
  communityId: number;

  @Column({
    type: 'simple-enum',
    enum: CommunityMembershipRequestStatus,
    default: CommunityMembershipRequestStatus.PENDING,
  })
  status: CommunityMembershipRequestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
