import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { CommunityRestrictionType } from '../community-restrictions.types';

@Entity('community_restrictions')
export class CommunityRestriction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-enum', enum: CommunityRestrictionType })
  restrictionType: CommunityRestrictionType;

  @ManyToOne(() => Community, (community) => community.restrictions)
  community: Community;

  @ManyToOne(() => User, (user) => user.communityRestrictions)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
