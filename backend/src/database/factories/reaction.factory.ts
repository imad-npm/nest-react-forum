import { Reaction } from '../../reactions/entities/reaction.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { ReactionType, Reactable } from '../../reactions/reactions.types';

export function reactionFactory(
  user: User,
  reactable: Post | Comment,
): Reaction {
  const reaction = new Reaction();
  reaction.user = user;
  reaction.type = Math.random() > 0.5 ? ReactionType.LIKE : ReactionType.DISLIKE;
  if (reactable instanceof Post) {
    reaction.reactableType = 'post';
    reaction.reactableId = reactable.id;
  } else {
    reaction.reactableType = 'comment';
    reaction.reactableId = reactable.id;
  }
  return reaction;
}
