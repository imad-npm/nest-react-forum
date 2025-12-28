import { Profile } from '../../profile/entities/profile.entity';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';

export function profileFactory(user: User): Profile {
  const profile = new Profile();
  profile.displayName = faker.person.fullName();
  profile.bio = faker.lorem.sentence();
  profile.picture = faker.image.avatar();
  profile.user = user; // Link profile to the provided user
  return profile;
}
