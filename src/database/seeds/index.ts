import { seedUsers } from './user.seed';
import { seedPosts } from './post.seed';
import { seedComments } from './comment.seed';
import { seedReactions } from './reaction.seed'; // <-- if you want to seed reactions
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

    console.log('Database seeding complete ✅');
  } catch (error) {
    console.error('Seeding failed ❌', error);
  } finally {
    // Optional: ensure datasource is destroyed if needed
    // await AppDataSource.destroy();
  }
}

main();
