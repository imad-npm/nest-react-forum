import { AppDataSource } from '../../data-source';
import { postFactory } from '../factories/post.factory';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

export async function seedPosts(users: User[]) {
  await AppDataSource.initialize();
  const postRepo = AppDataSource.getRepository(Post);

  const posts: Post[] = Array.from({ length: 10 }).map(() => {
    const author = users[Math.floor(Math.random() * users.length)];
    return postFactory(author);
  });

  await postRepo.save(posts);
  console.log('Seeded 10 posts ✅');

  await AppDataSource.destroy();
  return posts;
}

if (require.main === module) seedPosts([]);
