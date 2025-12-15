import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';

export function postFactory(author: User): Post {
  const post = new Post();
  post.title = faker.lorem.sentence();
  post.content = faker.lorem.paragraph();
  post.author = author;
  return post;
}
