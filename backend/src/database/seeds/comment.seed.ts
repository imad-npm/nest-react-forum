import { AppDataSource } from '../../data-source';
import { commentFactory } from '../factories/comment.factory';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

export async function seedComments(users: User[], posts: Post[]) {
  const commentRepo = AppDataSource.getRepository(Comment);
  const postRepo = AppDataSource.getRepository(Post);

  // 1. Create initial top-level comments
  const topLevelComments: Comment[] = [];
  for (let i = 0; i < 300; i++) {
    const author = users[Math.floor(Math.random() * users.length)];
    const post = posts[Math.floor(Math.random() * posts.length)];
    topLevelComments.push(commentFactory(author, post));
  }
  await commentRepo.save(topLevelComments);
  console.log(`Seeded ${topLevelComments.length} top-level comments ✅`);

  // 2. Create replies to top-level comments
  const firstLevelReplies: Comment[] = [];
  for (let i = 0; i < topLevelComments.length / 2; i++) {
    const parentComment = topLevelComments[i];
    const numberOfReplies = Math.floor(Math.random() * 3) + 1; // 1 to 3 replies
    for (let j = 0; j < numberOfReplies; j++) {
      const author = users[Math.floor(Math.random() * users.length)];
      const post = parentComment.post;
      firstLevelReplies.push(commentFactory(author, post, parentComment.id));
    }
  }
  await commentRepo.save(firstLevelReplies);
  console.log(`Seeded ${firstLevelReplies.length} first-level replies ✅`);

  // 3. Create nested replies (replies to replies)
  const secondLevelReplies: Comment[] = [];
  for (let i = 0; i < firstLevelReplies.length / 3; i++) {
    const parentComment = firstLevelReplies[i];
    const numberOfReplies = Math.floor(Math.random() * 2) + 1; // 1 to 2 replies
    for (let j = 0; j < numberOfReplies; j++) {
      const author = users[Math.floor(Math.random() * users.length)];
      const post = parentComment.post;
      secondLevelReplies.push(commentFactory(author, post, parentComment.id));
    }
  }
  await commentRepo.save(secondLevelReplies);
  console.log(`Seeded ${secondLevelReplies.length} second-level replies ✅`);

  const allComments = [...topLevelComments, ...firstLevelReplies, ...secondLevelReplies];
  console.log(`Seeded total ${allComments.length} comments ✅`);

  // Efficiently update commentsCount for all posts using a single query
  await postRepo
    .createQueryBuilder()
    .update(Post)
    .set({
      commentsCount: () =>
        `(SELECT COUNT(*) FROM comments WHERE comments.postId = posts.id)`
    })
    .execute();

  console.log('Updated commentsCount for all posts efficiently ✅');

  return allComments;
}

if (require.main === module) seedComments([], []);
