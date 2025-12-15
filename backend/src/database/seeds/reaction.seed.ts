import { AppDataSource } from '../../data-source';
import { postReactionFactory } from '../factories/post-reaction.factory';
import { commentReactionFactory } from '../factories/comment-reaction.factory';

import { PostReaction } from '../../reactions/entities/post-reaction.entity';
import { CommentReaction } from '../../reactions/entities/comment-reaction.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
export async function seedReactions(
  posts: Post[],
  comments: Comment[],
  users: User[],
): Promise<(PostReaction | CommentReaction)[]> {
  if (!users.length) {
    throw new Error('At least one user is required to seed reactions.');
  }

  const postReactionRepo = AppDataSource.getRepository(PostReaction);
  const commentReactionRepo = AppDataSource.getRepository(CommentReaction);
  const postRepo = AppDataSource.getRepository(Post);
  const commentRepo = AppDataSource.getRepository(Comment);

  const postReactionsToSave: PostReaction[] = [];
  const commentReactionsToSave: CommentReaction[] = [];

  const pickRandomUniqueUsers = (count: number): User[] => {
    const unique = new Set<number>();
    const picked: User[] = [];

    while (unique.size < count && unique.size < users.length) {
      const user = users[Math.floor(Math.random() * users.length)];
      if (!unique.has(user.id)) {
        unique.add(user.id);
        picked.push(user);
      }
    }
    return picked;
  };

  // ─────────────────────────────────────────────
  // POSTS
  // ─────────────────────────────────────────────
  for (const post of posts) {
    const num = Math.floor(Math.random() * 3) + 1;
    for (const user of pickRandomUniqueUsers(num)) {
      postReactionsToSave.push(postReactionFactory(user, post));
    }
  }

  // ─────────────────────────────────────────────
  // COMMENTS
  // ─────────────────────────────────────────────
  for (const comment of comments) {
    const num = Math.floor(Math.random() * 2) + 1;
    for (const user of pickRandomUniqueUsers(num)) {
      commentReactionsToSave.push(commentReactionFactory(user, comment));
    }
  }

  // ─────────────────────────────────────────────
  // SAVE
  // ─────────────────────────────────────────────
  const savedPostReactions = await postReactionRepo.save(postReactionsToSave);
  const savedCommentReactions = await commentReactionRepo.save(
    commentReactionsToSave,
  );

  // ─────────────────────────────────────────────
  // 🔁 REBUILD COUNTERS (THE IMPORTANT PART)
  // ─────────────────────────────────────────────

  // POSTS
  await postRepo
    .createQueryBuilder()
    .update(Post)
    .set({
      likesCount: () => `
        (
          SELECT COUNT(*)
          FROM post_reactions pr
          WHERE pr.postId = post.id
            AND pr.type = 'like'
        )
      `,
      dislikesCount: () => `
        (
          SELECT COUNT(*)
          FROM post_reactions pr
          WHERE pr.postId = post.id
            AND pr.type = 'dislike'
        )
      `,
    })
    .execute();

  // COMMENTS
  await commentRepo
    .createQueryBuilder()
    .update(Comment)
    .set({
      likesCount: () => `
        (
          SELECT COUNT(*)
          FROM comment_reactions cr
          WHERE cr.commentId = comment.id
            AND cr.type = 'like'
        )
      `,
      dislikesCount: () => `
        (
          SELECT COUNT(*)
          FROM comment_reactions cr
          WHERE cr.commentId = comment.id
            AND cr.type = 'dislike'
        )
      `,
    })
    .execute();

  const all = [...savedPostReactions, ...savedCommentReactions];
  console.log(`Seeded ${all.length} reactions ✅`);
  console.log(`Rebuilt like/dislike counters ✅`);

  return all;
}
