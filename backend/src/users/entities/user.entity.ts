// src/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { PostReaction } from '../../reactions/entities/post-reaction.entity';
import { CommentReaction } from '../../reactions/entities/comment-reaction.entity';
import { Profile } from '../../profile/entities/profile.entity'; // Import Profile
import { Community } from '../../communities/entities/community.entity';
import { CommunitySubscription } from '../../community-subscriptions/entities/community-subscription.entity';
import { CommunityModerator } from '../../community-moderators/entities/community-moderator.entity'; // Import CommunityModerator
import { PostReport } from '../../reports/entities/post-report.entity';
import { CommentReport } from '../../reports/entities/comment-report.entity'; // NEW IMPORT
import { UserReport } from '../../reports/entities/user-report.entity'; // NEW IMPORT


export enum UserRole {
  SUPER_ADMIN,
  ADMIN,
  USER
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'datetime', nullable: true, default: null })
  emailVerifiedAt: Date | null; // 👈 NEW FIELD

  @Column({
    type: 'simple-enum',
    enum: ['google', 'github'],
    nullable: true,
    default: null,
  })
  provider: 'google' | 'github' | null;

  @Column({ type: 'varchar', nullable: true })
  providerId: string | null; // Google's profile.id

  // One-to-one relation with Profile
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

    @Column({
    type: 'simple-enum', // sqlite compatible
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Relations
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => PostReaction, (reaction) => reaction.user)
  postReactions: PostReaction[];

  @OneToMany(() => CommentReaction, (reaction) => reaction.user)
  commentReactions: CommentReaction[];

  @OneToMany(() => Community, (community) => community.owner)
  createdCommunities: Community[];

  @OneToMany(
    () => CommunitySubscription,
    (communitySubscription) => communitySubscription.user,
  )
  communitySubscriptions: CommunitySubscription[];

  @OneToMany(() => CommunityModerator, (communityModerator) => communityModerator.moderator)
  moderatedCommunities: CommunityModerator[];

  @OneToMany(() => PostReport, (postReport) => postReport.reporter)
  postReports: PostReport[];

  @OneToMany(() => CommentReport, (commentReport) => commentReport.reporter) // NEW RELATION
  commentReports: CommentReport[];

  @OneToMany(() => UserReport, (userReport) => userReport.reporter)
  reportedUserReports: UserReport[];

  @OneToMany(() => UserReport, (userReport) => userReport.reportedUser)
  userReports: UserReport[];
}