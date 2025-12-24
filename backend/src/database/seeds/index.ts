import { seedUsers } from './user.seed';
import { seedPosts } from './post.seed';
import { seedComments } from './comment.seed';
import { seedReactions } from './reaction.seed';
import { seedCommunities } from './community.seed';
import { seedCommunityMemberships } from './community-membership.seed';
import { AppDataSource } from '../../data-source';

async function main() {
  try {
    await AppDataSource.initialize();
    // Seed users
    const users = await seedUsers();

    // Seed communities
    const communities = await seedCommunities(users);

    // Seed posts
    const posts = await seedPosts(users, communities);

    // Seed comments
    const comments = await seedComments(users, posts);

    // Seed reactions (optional)
    await seedReactions(posts, comments, users);

    // Seed community memberships
    await seedCommunityMemberships(users, communities);

    console.log('Database seeding complete ✅');
  } catch (error) {
    console.error('Seeding failed ❌', error);
  } finally {
    // Optional: ensure datasource is destroyed if needed
    // await AppDataSource.destroy();
  }
}

main();
