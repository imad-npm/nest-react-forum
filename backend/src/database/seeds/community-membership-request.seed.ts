import { AppDataSource } from '../../data-source';
import {
  CommunityMembershipRequest,
  CommunityMembershipRequestStatus,
} from '../../community-membership-requests/entities/community-membership-request.entity';
import { communityMembershipRequestFactory } from '../factories/community-membership-request.factory';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { CommunityMembership } from '../../community-memberships/entities/community-memberships.entity';
import { communityMembershipFactory } from '../factories/community-memberships.factory';
import { CommunityMembershipRole } from '../../community-memberships/types';

export async function seedCommunityMembershipRequests(
  users: User[],
  communities: Community[],
): Promise<CommunityMembershipRequest[]> {
  const requestRepo = AppDataSource.getRepository(CommunityMembershipRequest);
  const membershipRepo = AppDataSource.getRepository(CommunityMembership);
  const communityRepo = AppDataSource.getRepository(Community);


  if (users.length === 0 || communities.length === 0) {
    console.warn(
      'Skipping CommunityMembershipRequest seeding: No users or communities found.',
    );
    return [];
  }

  const communityMembershipRequests: CommunityMembershipRequest[] = [];
  const numberOfRequestsToAttempt = 50; // You can adjust this number

  // To keep track of already created requests to avoid duplicates
  const createdRequestPairs = new Set<string>();

  for (let i = 0; i < numberOfRequestsToAttempt; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCommunity =
      communities[Math.floor(Math.random() * communities.length)];

    const pairKey = `${randomUser.id}-${randomCommunity.id}`;

    if (createdRequestPairs.has(pairKey)) {
      continue; // Skip if this pair already has a pending request
    }

    // Check for existing request OR existing membership to prevent conflicts
    const existingRequest = await requestRepo.findOne({
      where: {
        userId: randomUser.id,
        communityId: randomCommunity.id,
      },
    });

    const existingMembership = await membershipRepo.findOne({
      where: {
        userId: randomUser.id,
        communityId: randomCommunity.id,
      },
    });


    if (!existingRequest && !existingMembership) {
      communityMembershipRequests.push(
        communityMembershipRequestFactory(randomUser, randomCommunity),
      );
      createdRequestPairs.add(pairKey);
    }
  }

  const savedRequests = await requestRepo.save(communityMembershipRequests);
  console.log(`Seeded ${savedRequests.length} community membership requests ✅`);

  const communityMemberships: CommunityMembership[] = [];
  // Track next moderator rank per community
  const nextRankByCommunity = new Map<number, number>();


  for (const request of savedRequests) {
    if (request.status === CommunityMembershipRequestStatus.ACCEPTED) {
      const membership = communityMembershipFactory();
      membership.userId = request.userId;
      membership.communityId = request.communityId;
      membership.user = request.user;
      membership.community = request.community;
      membership.role = CommunityMembershipRole.MEMBER; // Always assign MEMBER role
      membership.rank = null;
      communityMemberships.push(membership);
    }
  }

  await membershipRepo.save(communityMemberships);
  console.log(`Seeded ${communityMemberships.length} community memberships from accepted requests ✅`);

  await communityRepo
    .createQueryBuilder()
    .update(Community)
    .set({
      membersCount: () => `
        (
          SELECT COUNT(*)
          FROM community_memberships cm
          WHERE cm.communityId = communities.id
        )
      `,
    })
    .execute();
  console.log(`Updated communities.membersCount for new memberships ✅`);

  return savedRequests;
}
