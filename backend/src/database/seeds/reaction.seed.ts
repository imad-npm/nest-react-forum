import { AppDataSource } from '../../data-source';
import { reactionFactory } from '../factories/reaction.factory';

import { Reaction } from '../../reactions/entities/reaction.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

export async function seedReactions(
  posts: Post[],
  comments: Comment[],
  users: User[],
): Promise<Reaction[]> {
  if (!users.length) {
    throw new Error('At least one user is required to seed reactions.');
  }

  const reactionRepo = AppDataSource.getRepository(Reaction);
  const postRepo = AppDataSource.getRepository(Post);
  const commentRepo = AppDataSource.getRepository(Comment);

  const reactionsToSave: Reaction[] = [];

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
      reactionsToSave.push(reactionFactory(user, post));
    }
  }

  // ─────────────────────────────────────────────
  // COMMENTS
  // ─────────────────────────────────────────────
  for (const comment of comments) {
    const num = Math.floor(Math.random() * 2) + 1;
    for (const user of pickRandomUniqueUsers(num)) {
      reactionsToSave.push(reactionFactory(user, comment));
    }
  }

  // ─────────────────────────────────────────────
  // SAVE
  // ─────────────────────────────────────────────
  const savedReactions = await reactionRepo.save(reactionsToSave);

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
          FROM reactions r
          WHERE r.reactableId = posts.id
            AND r.reactableType = 'post'
            AND r.type = 'like'
        )
      `,
      dislikesCount: () => `
        (
          SELECT COUNT(*)
          FROM reactions r
          WHERE r.reactableId = posts.id
            AND r.reactableType = 'post'
            AND r.type = 'dislike'
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
          FROM reactions r
          WHERE r.reactableId = comments.id
            AND r.reactableType = 'comment'
            AND r.type = 'like'
        )
      `,
      dislikesCount: () => `
        (
          SELECT COUNT(*)
          FROM reactions r
          WHERE r.reactableId = comments.id
            AND r.reactableType = 'comment'
            and r.type = 'dislike'
        )
      `,
    })
    .execute();

  console.log(`Seeded ${savedReactions.length} reactions ✅`);
  console.log(`Rebuilt like/dislike counters ✅`);

  return savedReactions;
}
