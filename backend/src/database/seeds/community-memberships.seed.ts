import { AppDataSource } from '../../data-source';
import { communityMembershipFactory } from '../factories/community-membership.factory';
import { CommunityMembership } from '../../community-memberships/entities/community-membership.entity';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';

export async function seedCommunityMemberships(
  users: User[],
  communities: Community[],
): Promise<CommunityMembership[]> {
  const membershipRepo = AppDataSource.getRepository(CommunityMembership);
  const communityRepo = AppDataSource.getRepository(Community);

  const memberships: CommunityMembership[] = [];

  for (const user of users) {
    const numMemberships = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...communities].sort(() => 0.5 - Math.random());
    const toSubscribe = shuffled.slice(0, numMemberships);

    for (const community of toSubscribe) {
      const membership = communityMembershipFactory();
      membership.userId = user.id;
      membership.communityId = community.id;
      memberships.push(membership);
    }
  }

  await membershipRepo.save(memberships);

  // ─────────────────────────────────────────────
  // UPDATE subscribers_count (CORRECT WAY)
  // ─────────────────────────────────────────────
  await communityRepo
    .createQueryBuilder()
    .update(Community)
    .set({
      membersCount: () => `
        (
          SELECT COUNT(*)
          FROM community_memberships cs
          WHERE cs.communityId = communities.id
        )
      `,
    })
    .execute();

  console.log(`Seeded ${memberships.length} community memberships ✅`);
  console.log(`Updated communities.subscribers_count ✅`);

  return memberships;
}

if (require.main === module) {
  AppDataSource.initialize().then(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const communityRepo = AppDataSource.getRepository(Community);
    const users = await userRepo.find();
    const communities = await communityRepo.find();
    await seedCommunityMemberships(users, communities);
  }).catch(error => console.error('Seeding failed ❌', error));
}
