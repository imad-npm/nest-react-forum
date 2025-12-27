import { AppDataSource } from '../../data-source';
import { communityMembershipFactory } from '../factories/community-memberships.factory';
import { CommunityMembership } from '../../community-memberships/entities/community-memberships.entity';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { CommunityMembershipRole } from '../../community-memberships/types';


export async function seedCommunityMemberships(
  users: User[],
  communities: Community[],
): Promise<CommunityMembership[]> {
  const membershipRepo = AppDataSource.getRepository(CommunityMembership);
  const communityRepo = AppDataSource.getRepository(Community);

  const memberships: CommunityMembership[] = [];

  // Track next moderator rank per community
  const nextRankByCommunity = new Map<number, number>();

  function randomRole(): CommunityMembership['role'] {
    return Math.random() < 0.1
      ? CommunityMembershipRole.MODERATOR
      : CommunityMembershipRole.MEMBER;
  }

  for (const user of users) {
    const numMemberships = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...communities].sort(() => 0.5 - Math.random());
    const toSubscribe = shuffled.slice(0, numMemberships);

    for (const community of toSubscribe) {
      const membership = communityMembershipFactory();
      membership.userId = user.id;
      membership.communityId = community.id;

      membership.role = randomRole();

      if (membership.role === CommunityMembershipRole.MODERATOR) {
        const nextRank = nextRankByCommunity.get(community.id) ?? 0;
        membership.rank = nextRank;
        nextRankByCommunity.set(community.id, nextRank + 1);
      } else {
        membership.rank = null;
      }

      memberships.push(membership);
    }
  }

  await membershipRepo.save(memberships);

  await communityRepo
    .createQueryBuilder()
    .update(Community)
    .set({
      membersCount: () => `
        (
          SELECT COUNT(*)
          FROM community_memberships cm
          WHERE cm.communityId = communities.id
        )
      `,
    })
    .execute();

  console.log(`Seeded ${memberships.length} community memberships ✅`);
  console.log(`Updated communities.membersCount ✅`);

  return memberships;
}
