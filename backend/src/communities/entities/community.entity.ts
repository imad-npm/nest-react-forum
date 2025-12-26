import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { CommunityMembership } from '../../community-memberships/entities/community-memberships.entity';
import { CommunityMembershipRequest } from '../../community-membership-requests/entities/community-membership-request.entity';
import { CommunityType } from '../types';

@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

@ManyToOne(() => User, (user) => user.createdCommunities)
owner: User;

@Column({ nullable: true })
ownerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'simple-enum', enum : CommunityType, default: CommunityType.PUBLIC })
  communityType: CommunityType;

  @Column({ type: 'integer', default: 0 })
  membersCount: number;

  userMembershipStatus?: 'member' | 'pending' | 'none';

  @OneToMany(() => Post, (post) => post.community)
  posts: Post[];

  @OneToMany(
    () => CommunityMembership,
    (membership) => membership.community,
  )
  memberships: CommunityMembership[];

  @OneToMany(
    () => CommunityMembershipRequest,
    (request) => request.community,
  )
  membershipRequests: CommunityMembershipRequest[];
}
