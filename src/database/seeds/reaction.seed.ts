import { AppDataSource } from '../../data-source';
import { postReactionFactory } from '../factories/post-reaction.factory';
import { commentReactionFactory } from '../factories/comment-reaction.factory';

import { PostReaction } from '../../reactions/entities/post-reaction.entity';
import { CommentReaction } from '../../reactions/entities/comment-reaction.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Seed Reactions for given posts and comments using provided users
 */
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

  const postReactionsToSave: PostReaction[] = [];
  const commentReactionsToSave: CommentReaction[] = [];

  /**
   * Pick N users without duplicates
   */
  const pickRandomUniqueUsers = (count: number): User[] => {
    const uniqueUsers = new Set<number>();
    const picked: User[] = [];

    while (uniqueUsers.size < count && uniqueUsers.size < users.length) {
      const user = users[Math.floor(Math.random() * users.length)];
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.add(user.id);
        picked.push(user);
      }
    }

    return picked;
  };

  // ------------------------------------------------------------
  // 🟦 Reactions for Posts (1–3 reactions per post)
  // ------------------------------------------------------------
  for (const post of posts) {
    const numReactions = Math.floor(Math.random() * 3) + 1; // 1–3
    const selectedUsers = pickRandomUniqueUsers(numReactions);

    for (const user of selectedUsers) {
      postReactionsToSave.push(postReactionFactory(user, post));
    }
  }

  // ------------------------------------------------------------
  // 🟩 Reactions for Comments (1–2 reactions per comment)
  // ------------------------------------------------------------
  for (const comment of comments) {
    const numReactions = Math.floor(Math.random() * 2) + 1; // 1–2
    const selectedUsers = pickRandomUniqueUsers(numReactions);

    for (const user of selectedUsers) {
      commentReactionsToSave.push(commentReactionFactory(user, comment));
    }
  }

  // ------------------------------------------------------------
  // 🟪 Save to DB
  // ------------------------------------------------------------
  const savedPostReactions = await postReactionRepo.save(postReactionsToSave);
  const savedCommentReactions = await commentReactionRepo.save(
    commentReactionsToSave,
  );

  const all = [...savedPostReactions, ...savedCommentReactions];
  console.log(`Seeded ${all.length} reactions ✅`);

  return all;
}
