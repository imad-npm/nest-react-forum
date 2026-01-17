import { postFactory } from '../factories/post.factory';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { AppDataSource } from '../../data-source';
import { CommunityMembership } from '../../community-memberships/entities/community-memberships.entity';

export async function seedPosts(users: User[], communities: Community[]) {
  const postRepo = AppDataSource.getRepository(Post);
  const membershipRepo = AppDataSource.getRepository(CommunityMembership);

  const posts: Post[] = [];

  for (let i = 0; i < 60; i++) {
    const community =
      communities[Math.floor(Math.random() * communities.length)];
      console.log(community);
      

    // Get members of this community WITH users
    const memberships = await membershipRepo.find({
      where: { communityId: community.id },
      relations: ['user'],
    });

    if (memberships.length === 0) continue;

    const membership =
      memberships[Math.floor(Math.random() * memberships.length)];

    const author = membership.user;

    posts.push(postFactory(author, community));
  }

  await postRepo.save(posts);
  console.log(`Seeded ${posts.length} posts ✅`);

  return posts;
}

if (require.main === module) {
  seedPosts([], []);
}
