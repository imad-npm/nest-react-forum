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
import { CommunitySubscription } from '../../community-subscriptions/entities/community-subscription.entity';
import { CommunityType } from '../types';
import { CommunityModerator } from '../../community-moderators/entities/community-moderator.entity'; // Import CommunityModerator

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
  subscribersCount: number;

  @OneToMany(() => Post, (post) => post.community)
  posts: Post[];

  @OneToMany(
    () => CommunitySubscription,
    (subscription) => subscription.community,
  )
  subscriptions: CommunitySubscription[];

  @OneToMany(() => CommunityModerator, (communityModerator) => communityModerator.community)
  moderators: CommunityModerator[];
}
