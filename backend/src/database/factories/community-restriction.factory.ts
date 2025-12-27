import { CommunityRestriction } from '../../community-restrictions/entities/community-restriction.entity';
import { CommunityRestrictionType } from '../../community-restrictions/community-restrictions.types';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { AppDataSource } from '../../data-source';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

export function communityRestrictionFactory(
  user: User,
  community: Community,
  createdBy: User,
): CommunityRestriction {
  const communityRestrictionRepository: Repository<CommunityRestriction> =
    AppDataSource.getRepository(CommunityRestriction);

  return communityRestrictionRepository.create({
    restrictionType: faker.helpers.arrayElement([
      CommunityRestrictionType.BAN,
      CommunityRestrictionType.MUTE,
    ]),
    reason: faker.lorem.sentence(),
    expiresAt: faker.date.future(),
    user: user,
    community: community,
    createdBy: createdBy,
    createdById: createdBy.id,
  });
}
