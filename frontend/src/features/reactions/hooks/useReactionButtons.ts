import {
  useCreateReactionMutation,
  useDeleteReactionMutation,
  useUpdateReactionMutation,
} from '../services/reactionApi';

import type { Comment } from '../../comments/types';
import type { Post } from '../../posts/types';
import { ReactionTarget, ReactionType } from '../types/types';

interface UseReactionButtonsProps {
  target: Post | Comment;
}

export const useReactionButtons = ({
  target,
}: UseReactionButtonsProps) => {
  const [createReaction] = useCreateReactionMutation();
  const [deleteReaction] = useDeleteReactionMutation();
  const [updateReaction] = useUpdateReactionMutation();
 const targetType =
    'title' in target ? ReactionTarget.Post : ReactionTarget.Comment;

  const handleLike = async () => {
    if (target.userReaction?.type === ReactionType.LIKE) {
      await deleteReaction({
        id: target.userReaction.id!,
        data: { target: targetType },
      });
      return;
    }

    if (target.userReaction?.type === ReactionType.DISLIKE) {
      await updateReaction({
        id: target.userReaction.id!,
        data: {
          type: ReactionType.LIKE,
          target: targetType,
          targetId:target.id
        },
      });
      return;
    }

    await createReaction({
      type: ReactionType.LIKE,
      target: targetType,
      targetId: target.id,
    });
  };

  const handleDislike = async () => {
    if (target.userReaction?.type === ReactionType.DISLIKE) {
      await deleteReaction({
        id: target.userReaction.id!,
        data: { target: targetType },
      });
      return;
    }

    if (target.userReaction?.type === ReactionType.LIKE) {
      await updateReaction({
        id: target.userReaction.id!,
        data: {
          type: ReactionType.DISLIKE,
          target: targetType,
          targetId:target.id
        },
      });
      return;
    }

    await createReaction({
      type: ReactionType.DISLIKE,
      target: targetType,
      targetId: target.id,
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
