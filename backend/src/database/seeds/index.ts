import { seedUsers } from './user.seed';
import { seedPosts } from './post.seed';
import { seedComments } from './comment.seed';
import { seedReactions } from './reaction.seed';
import { seedCommunities } from './community.seed';
import { seedCommunitySubscriptions } from './community-subscription.seed';
import { AppDataSource } from '../../data-source';

async function main() {
  try {
    await AppDataSource.initialize();
    // Seed users
    const users = await seedUsers();

    // Seed posts
    const posts = await seedPosts(users);

    // Seed comments
    const comments = await seedComments(users, posts);

    // Seed reactions (optional)
    await seedReactions(posts, comments, users);

    // Seed communities
    const communities = await seedCommunities(users);

    // Seed community subscriptions
    await seedCommunitySubscriptions(users, communities);

    console.log('Database seeding complete ✅');
  } catch (error) {
    console.error('Seeding failed ❌', error);
  } finally {
    // Optional: ensure datasource is destroyed if needed
    // await AppDataSource.destroy();
  }
}

main();
