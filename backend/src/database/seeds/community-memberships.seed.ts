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

  for (const user of users) {
    const numMemberships = Math.floor(Math.random() * 3) + 1; // 1 to 3 communities
    const shuffled = [...communities].sort(() => 0.5 - Math.random());
    const toSubscribe = shuffled.slice(0, numMemberships);

    for (let i = 0; i < toSubscribe.length; i++) {
      const community = toSubscribe[i];
      const membership = communityMembershipFactory();
      membership.userId = user.id;
      membership.communityId = community.id;

      // First community for a user is always a moderator role
      if (i === 0) {
        membership.role = CommunityMembershipRole.MODERATOR;
        const nextRank = nextRankByCommunity.get(community.id) ?? 0;
        membership.rank = nextRank;
        nextRankByCommunity.set(community.id, nextRank + 1);
      } else {
        membership.role = CommunityMembershipRole.MEMBER;
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
