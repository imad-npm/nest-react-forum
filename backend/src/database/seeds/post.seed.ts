import { postFactory } from '../factories/post.factory';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity'; // Import Community entity
import { AppDataSource } from '../../data-source';

export async function seedPosts(users: User[], communities: Community[]) {
  const postRepo = AppDataSource.getRepository(Post);

  const posts: Post[] = Array.from({ length: 30 }).map(() => {
    const author = users[Math.floor(Math.random() * users.length)];
    const community = communities[Math.floor(Math.random() * communities.length)]; // Select a random community
    return postFactory(author, community);
  });

  await postRepo.save(posts);
  console.log('Seeded 100 posts ✅');

  return posts;
}

if (require.main === module) seedPosts([], []);
