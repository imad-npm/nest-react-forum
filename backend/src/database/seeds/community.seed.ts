import { AppDataSource } from '../../data-source';
import { communityFactory } from '../factories/community.factory';
import { Community } from '../../communities/entities/community.entity';
import { User } from '../../users/entities/user.entity';

export async function seedCommunities(users: User[]): Promise<Community[]> {
  const communityRepo = AppDataSource.getRepository(Community);
  const communities: Community[] = Array.from({ length: 8 }).map(() => {
    const community = communityFactory();
    community.owner = users[Math.floor(Math.random() * users.length)];
    community.ownerId = community.owner.id;
    return community;
  });

  await communityRepo.save(communities);
  console.log(`Seeded ${communities.length} communities ✅`);
  return communities;
}

if (require.main === module) {
  AppDataSource.initialize().then(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find();
    await seedCommunities(users);
  }).catch(error => console.error('Seeding failed ❌', error));
}
