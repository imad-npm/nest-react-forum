import { CommentReaction } from '../../reactions/entities/comment-reaction.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { ReactionType } from '../../reactions/reactions.types';

/**
 * Creates a CommentReaction object.
 */
export function commentReactionFactory(user: User, comment: Comment): CommentReaction {
  const reaction = new CommentReaction();
  
  reaction.user = user;
  reaction.comment = comment;

  const types = Object.values(ReactionType);
  reaction.type = faker.helpers.arrayElement(types);

  return reaction;
}
