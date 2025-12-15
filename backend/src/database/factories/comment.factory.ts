import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { faker } from '@faker-js/faker';

export function commentFactory(author: User, post: Post): Comment {
  const comment = new Comment();
  comment.content = faker.lorem.sentence();
  comment.author = author;
  comment.post = post;
  return comment;
}
