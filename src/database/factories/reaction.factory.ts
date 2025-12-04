import { Reaction, ReactionType } from '../../reactions/entities/reaction.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity'; // <-- ADDED USER IMPORT
import { faker } from '@faker-js/faker';

/**
 * Creates a Reaction object. Requires a User (user) and either a Post or a Comment target.
 */
export function reactionFactory(user: User, post?: Post, comment?: Comment): Reaction {
  if (!post && !comment) {
    throw new Error('Reaction factory must be called with a Post or a Comment.');
  }

  const reaction = new Reaction();
  
  // Assign the reaction author
  reaction.user = user;

  // Randomly assign a reaction type
  const types = Object.values(ReactionType);
  reaction.type = faker.helpers.arrayElement(types);

  // Assign the target entity (polymorphism via nullable columns)
  reaction.post = post ?? null;
  reaction.comment = comment ?? null;

  return reaction;
}
