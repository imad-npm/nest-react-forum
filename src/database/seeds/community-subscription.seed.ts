import { AppDataSource } from '../../data-source';
import { communitySubscriptionFactory } from '../factories/community-subscription.factory';
import { CommunitySubscription } from '../../community-subscriptions/entities/community-subscription.entity';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';

export async function seedCommunitySubscriptions(users: User[], communities: Community[]): Promise<CommunitySubscription[]> {
  const subscriptionRepo = AppDataSource.getRepository(CommunitySubscription);
  const subscriptions: CommunitySubscription[] = [];

  for (const user of users) {
    // Each user subscribes to 1 to 3 random communities
    const numSubscriptions = Math.floor(Math.random() * 3) + 1;
    const shuffledCommunities = communities.sort(() => 0.5 - Math.random());
    const communitiesToSubscribe = shuffledCommunities.slice(0, numSubscriptions);

    for (const community of communitiesToSubscribe) {
      const subscription = communitySubscriptionFactory();
      subscription.userId = user.id;
      subscription.communityId = community.id;
      subscriptions.push(subscription);
    }
  }

  await subscriptionRepo.save(subscriptions);
  console.log(`Seeded ${subscriptions.length} community subscriptions ✅`);
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
