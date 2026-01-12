import {
  useCreateReactionMutation,
  useDeleteReactionMutation,
  useUpdateReactionMutation,
} from '../services/reactionApi';

import type { Comment } from '../../comments/types';
import type { Post } from '../../posts/types';
import { ReactionType,  Reactable } from '../types/types';

interface UseReactionButtonsProps {
  target: Post | Comment;
}

export const useReactionButtons = ({ target }: UseReactionButtonsProps) => {
  const [createReaction] = useCreateReactionMutation();
  const [deleteReaction] = useDeleteReactionMutation();
  const [updateReaction] = useUpdateReactionMutation();

  // Determine reactableType based on target
  const reactableType =
    'title' in target ? Reactable.Post : Reactable.Comment;

  const handleLike = async () => {
    if (target.userReaction?.type === ReactionType.LIKE) {
      // Remove existing like
      await deleteReaction({
        id: target.userReaction.id!,
        reactableType:reactableType
      });
      return;
    }

    if (target.userReaction?.type === ReactionType.DISLIKE) {
      // Switch dislike -> like
      await updateReaction({
        id: target.userReaction.id!,
        data: {
          type: ReactionType.LIKE,
        },
        reactableType:reactableType

      });
      return;
    }

    // Create new like
    await createReaction({
      type: ReactionType.LIKE,
      reactableType,
      reactableId: target.id,
    });
  };

  const handleDislike = async () => {
    if (target.userReaction?.type === ReactionType.DISLIKE) {
      // Remove existing dislike
      await deleteReaction({
        id: target.userReaction.id!,
        reactableType:reactableType
      });
      return;
    }

    if (target.userReaction?.type === ReactionType.LIKE) {
      // Switch like -> dislike
      await updateReaction({
        id: target.userReaction.id!,
        data: {
          type: ReactionType.DISLIKE,
        },
        reactableType: reactableType

      });
      return;
    }

    // Create new dislike
    await createReaction({
      type: ReactionType.DISLIKE,
      reactableType,
      reactableId: target.id,
    });
  };

  return {
    handleLike,
    handleDislike,
    likesCount: target.likesCount,
    dislikesCount: target.dislikesCount,
    userReactionType: target.userReaction?.type,
  };
};
