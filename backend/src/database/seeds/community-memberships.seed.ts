import { AppDataSource } from '../../data-source';
import { communitySubscriptionFactory } from '../factories/community-membership.factory';
import { CommunityMembership } from '../../community-memberships/entities/community-membership.entity';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';

export async function seedCommunitySubscriptions(
  users: User[],
  communities: Community[],
): Promise<CommunityMembership[]> {
  const subscriptionRepo = AppDataSource.getRepository(CommunityMembership);
  const communityRepo = AppDataSource.getRepository(Community);

  const subscriptions: CommunityMembership[] = [];

  for (const user of users) {
    const numSubscriptions = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...communities].sort(() => 0.5 - Math.random());
    const toSubscribe = shuffled.slice(0, numSubscriptions);

    for (const community of toSubscribe) {
      const subscription = communitySubscriptionFactory();
      subscription.userId = user.id;
      subscription.communityId = community.id;
      subscriptions.push(subscription);
    }
  }

  await subscriptionRepo.save(subscriptions);

  // ─────────────────────────────────────────────
  // UPDATE subscribers_count (CORRECT WAY)
  // ─────────────────────────────────────────────
  await communityRepo
    .createQueryBuilder()
    .update(Community)
    .set({
      subscribersCount: () => `
        (
          SELECT COUNT(*)
          FROM community_memberships cs
          WHERE cs.communityId = communities.id
        )
      `,
    })
    .execute();

  console.log(`Seeded ${subscriptions.length} community subscriptions ✅`);
  console.log(`Updated communities.subscribers_count ✅`);

  return subscriptions;
}

if (require.main === module) {
  AppDataSource.initialize().then(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const communityRepo = AppDataSource.getRepository(Community);
    const users = await userRepo.find();
    const communities = await communityRepo.find();
    await seedCommunitySubscriptions(users, communities);
  }).catch(error => console.error('Seeding failed ❌', error));
}
