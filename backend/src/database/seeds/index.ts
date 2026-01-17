import { seedUsers } from './user.seed';
import { seedProfiles } from './profile.seed'; // NEW IMPORT
import { seedPosts } from './post.seed';
import { seedComments } from './comment.seed';
import { seedReactions } from './reaction.seed';
import { seedCommunities } from './community.seed';
import { seedCommunityMemberships } from './community-memberships.seed';
import { seedCommunityMembershipRequests } from './community-membership-request.seed';
import { seedCommunityRestrictions } from './community-restriction.seed';
import { seedNotifications } from './notification.seed'; // NEW IMPORT
import { AppDataSource } from '../../data-source';

async function main() {
  try {
    await AppDataSource.initialize();
    // Seed users
    const users = await seedUsers();

    // Seed profiles
    await seedProfiles();

    // Seed communities
    const communities = await seedCommunities(users);

      // Seed community memberships
    await seedCommunityMemberships(users, communities);


    // Seed posts
    const posts = await seedPosts(users, communities);

    // Seed comments
    const comments = await seedComments(users, posts);

    // Seed reactions (optional)
    await seedReactions(posts, comments, users);

  
    // Seed community membership requests
    await seedCommunityMembershipRequests(users, communities);

    // Seed community restrictions
    await seedCommunityRestrictions(users, communities);

    // Seed notifications
    await seedNotifications(AppDataSource, users, posts, comments);

    console.log('Database seeding complete ✅');
  } catch (error) {
    console.error('Seeding failed ❌', error);
  } finally {
    // Optional: ensure datasource is destroyed if needed
    // await AppDataSource.destroy();
  }
}

main();
