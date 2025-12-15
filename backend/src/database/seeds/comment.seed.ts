import { AppDataSource } from '../../data-source';
import { commentFactory } from '../factories/comment.factory';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

export async function seedComments(users: User[], posts: Post[]) {
  const commentRepo = AppDataSource.getRepository(Comment);

  const comments: Comment[] = Array.from({ length: 100 }).map(() => {
    const author = users[Math.floor(Math.random() * users.length)];
    const post = posts[Math.floor(Math.random() * posts.length)];
    return commentFactory(author, post);
  });

  await commentRepo.save(comments);
  console.log('Seeded 100 comments ✅');

  return comments; // <-- important!
}

if (require.main === module) seedComments([], []);
