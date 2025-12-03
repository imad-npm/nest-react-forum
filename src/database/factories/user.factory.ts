import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';

export function userFactory(): User {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  return user;
}
