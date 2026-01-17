import { AppDataSource } from '../../data-source';
import { userFactory } from '../factories/user.factory';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export async function seedUsers() {
  const userRepo = AppDataSource.getRepository(User);

  const users: User[] = Array.from({ length: 100 }).map(() => {
    return userFactory();
  });

  // Handle the special 'testuser'
  const testUser = new User();
  testUser.username = 'testuser';
  testUser.email = 'test@example.com';
  testUser.password = bcrypt.hashSync('password123', 10);
  testUser.emailVerifiedAt = new Date();

  users.push(testUser);

  await Promise.all(
    users.map(async (user) => {
      await userRepo.save(user); // Save user
    }),
  );

  console.log(`Seeded ${users.length} users ✅`);

  return users;
}

if (require.main === module) seedUsers();
