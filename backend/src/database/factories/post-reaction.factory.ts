import { PostReaction } from '../../reactions/entities/post-reaction.entity';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { ReactionType } from '../../reactions/reactions.types';

/**
 * Creates a PostReaction object.
 */
export function postReactionFactory(user: User, post: Post): PostReaction {
  const reaction = new PostReaction();

  reaction.user = user;
  reaction.post = post;

  const types = Object.values(ReactionType);
  reaction.type = faker.helpers.arrayElement(types);

  return reaction;
}
