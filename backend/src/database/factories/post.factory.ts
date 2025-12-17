import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity'; // Import Community entity
import { faker } from '@faker-js/faker';

export function postFactory(author: User, community: Community): Post {
  const post = new Post();
  post.title = faker.lorem.sentence();
  post.content = faker.lorem.paragraph();
  post.author = author;
  post.community = community; // Assign community
  return post;
}
