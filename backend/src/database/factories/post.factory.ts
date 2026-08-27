import {
  Post,
  PostStatus,
} from '../../posts/entities/post.entity';

import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { faker } from '@faker-js/faker';

export function postFactory(author: User, community: Community): Post {
  const post = new Post();

  post.title = faker.lorem.sentence();
  post.content = faker.lorem.paragraph();

  post.author = author;
  post.authorId = author.id;

  post.community = community;
  post.communityId = community.id;

  const status = faker.helpers.weightedArrayElement([
    { value: PostStatus.APPROVED, weight: 60 },
    { value: PostStatus.PENDING, weight: 25 },
    { value: PostStatus.REJECTED, weight: 15 },
  ]);

  post.status = status;

  // Only approved posts should have a publication date
  post.publishedAt =
    status === PostStatus.APPROVED
      ? faker.date.recent({ days: 30 })
      : null;

  return post;
}