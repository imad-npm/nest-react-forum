import { seedUsers } from './user.seed';
import { seedPosts } from './post.seed';
import { seedComments } from './comment.seed';

async function main() {
  const users = await seedUsers();
  const posts = await seedPosts(users);
  await seedComments(users, posts);
}

main().then(() => console.log('Database seeding complete ✅'));
