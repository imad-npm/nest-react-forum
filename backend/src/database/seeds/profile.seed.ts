import { AppDataSource } from '../../data-source';
import { User } from '../../users/entities/user.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { profileFactory } from '../factories/profile.factory';

export async function seedProfiles() {
  const userRepo = AppDataSource.getRepository(User);
  const profileRepo = AppDataSource.getRepository(Profile);

  const usersWithoutProfiles = await userRepo
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.profile', 'profile')
    .where('profile.id IS NULL')
    .getMany();

  const profiles: Profile[] = [];

  for (const user of usersWithoutProfiles) {
    const newProfile = profileFactory(user);
    profiles.push(newProfile);
  }

  await profileRepo.save(profiles);

  console.log(`Seeded ${profiles.length} profiles ✅`);

  return profiles;
}



if (require.main === module) seedProfiles();
