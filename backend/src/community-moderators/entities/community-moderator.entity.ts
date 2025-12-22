// backend/src/community-moderators/entities/community-moderator.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';

@Entity('community_moderators')
export class CommunityModerator {
  @PrimaryColumn()
  moderatorId: number;

  @PrimaryColumn()
  communityId: number;

  @ManyToOne(() => User, (user) => user.moderatedCommunities)
  moderator: User;

  @ManyToOne(() => Community, (community) => community.moderators)
  community: Community;
}
