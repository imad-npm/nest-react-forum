import { faker } from '@faker-js/faker';
import { Community } from '../../communities/entities/community.entity';
import { CommunityType } from '../../communities/types';

export function communityFactory(): Community {
  const community = new Community();
  community.name = faker.internet.username();
  community.displayName = faker.company.name();
  community.description = faker.lorem.paragraph();
  community.communityType = faker.helpers.arrayElement(Object.values(CommunityType));
  community.subscribersCount = faker.number.int({ min: 0, max: 1000 });
  return community;
}
