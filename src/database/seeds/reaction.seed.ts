import { AppDataSource } from '../../data-source';
import { reactionFactory } from '../factories/reaction.factory';
import { Reaction } from '../../reactions/entities/reaction.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Seed Reactions for given posts and comments using provided users
 */
export async function seedReactions(posts: Post[], comments: Comment[], users: User[]): Promise<Reaction[]> {
  if (!users.length) {
    throw new Error('At least one user is required to seed reactions.');
  }

  await AppDataSource.initialize();
  const reactionRepo = AppDataSource.getRepository(Reaction);
  const reactions: Reaction[] = [];

  // Generate Reactions for Posts (1-3 reactions per post)
  posts.forEach(post => {
    const numReactions = Math.floor(Math.random() * 3) + 1; 
    for (let i = 0; i < numReactions; i++) {
      // Pick a random user
      const user = users[Math.floor(Math.random() * users.length)];
      reactions.push(reactionFactory(user, post, undefined));
    }
  });

  // Generate Reactions for Comments (1-2 reactions per comment)
  comments.forEach(comment => {
    const numReactions = Math.floor(Math.random() * 2) + 1; 
    for (let i = 0; i < numReactions; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      reactions.push(reactionFactory(user, undefined, comment));
    }
  });

  await reactionRepo.save(reactions);
  console.log(`Seeded ${reactions.length} reactions ✅`);

  await AppDataSource.destroy();
  return reactions;
}

