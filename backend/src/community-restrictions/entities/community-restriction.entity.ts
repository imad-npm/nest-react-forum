import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
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

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  // Explicit community foreign key
  @Column()
  communityId: number;

  @ManyToOne(() => Community, (community) => community.restrictions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'communityId' })
  community: Community;

  // Explicit user foreign key
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.communityRestrictions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Explicit createdBy foreign key
  @Column()
  createdById: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
