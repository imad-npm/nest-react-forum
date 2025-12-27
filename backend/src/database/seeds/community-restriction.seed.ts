import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { CommunityRestriction } from '../../community-restrictions/entities/community-restriction.entity';
import { communityRestrictionFactory } from '../factories/community-restriction.factory';
import { AppDataSource } from '../../data-source';

export async function seedCommunityRestrictions(
  users: User[],
  communities: Community[],
): Promise<CommunityRestriction[]> {
  const restrictions: CommunityRestriction[] = [];
  const communityRestrictionRepository = AppDataSource.getRepository(CommunityRestriction);

  for (const community of communities) {
    const bannedUser = users.find((user) => user.id !== community.ownerId);
    const creatorUser = users[Math.floor(Math.random() * users.length)];

    if (bannedUser && creatorUser) {
      const restriction = communityRestrictionFactory(
        bannedUser,
        community,
        creatorUser,
      );
      restrictions.push(restriction);
    }
  }

  return communityRestrictionRepository.save(restrictions);
}
