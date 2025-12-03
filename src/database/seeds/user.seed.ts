import { AppDataSource } from '../../data-source';
import { userFactory } from '../factories/user.factory';
import { User } from '../../users/entities/user.entity';

export async function seedUsers() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  const users: User[] = Array.from({ length: 5 }).map(() => userFactory());

  await userRepo.save(users);
  console.log('Seeded 5 users ✅');

  await AppDataSource.destroy();
  return users;
}

if (require.main === module) seedUsers();
