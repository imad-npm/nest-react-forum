import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';

export enum CommunityMembershipRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('community_membership_requests')
@Unique(['userId', 'communityId']) // prevent duplicates
export class CommunityMembershipRequest {
  // Composite primary key: userId + communityId

   @PrimaryGeneratedColumn()
  id: number; // surrogate PK
  
    @Column()
  userId: number;

  @Column()
  communityId: number;

  @ManyToOne(() => User, (user) => user.communityMembershipRequests)
  user: User;

  @ManyToOne(() => Community, (community) => community.membershipRequests)
  community: Community;

  @Column({
    type: 'simple-enum',
    enum: CommunityMembershipRequestStatus,
    default: CommunityMembershipRequestStatus.PENDING,
  })
  status: CommunityMembershipRequestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
