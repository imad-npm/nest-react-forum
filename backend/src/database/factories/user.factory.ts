import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export function userFactory(): User {
  const user = new User();

  user.username = faker.internet.username();
  user.email = faker.internet.email();

  // --- Add bcrypt password ---
  const plainPassword = 'password1'; // or faker.internet.password();
  const saltRounds = 10;

  user.password = bcrypt.hashSync(plainPassword, saltRounds);

  return user;
}
