import { AppDataSource } from '../../data-source';
import { userFactory } from '../factories/user.factory';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';

export async function seedUsers() {
  const userRepo = AppDataSource.getRepository(User);

  const users: User[] = Array.from({ length: 100 }).map(() => userFactory());

  const user = new User();
  user.name = 'Test User';
  user.email = 'test@example.com';
  user.password = bcrypt.hashSync('password123', 10);

  users.push(user);

  await userRepo.save(users);
  console.log('Seeded 5 users ✅');

  return users;
}

if (require.main === module) seedUsers();
