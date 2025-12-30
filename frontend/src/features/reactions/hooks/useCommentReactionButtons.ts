import {
  useCreateCommentReactionMutation,
  useDeleteCommentReactionMutation,
  useUpdateCommentReactionMutation,
} from '../services/reactionApi';
import type { Comment } from '../../comments/types';
import { ReactionType } from '../types/types';

interface UseCommentReactionButtonsProps {
  comment: Comment;
}

export const useCommentReactionButtons = ({
  comment,
}: UseCommentReactionButtonsProps) => {
  const [createReaction] = useCreateCommentReactionMutation();
  const [deleteReaction] = useDeleteCommentReactionMutation();
  const [updateReaction] = useUpdateCommentReactionMutation();

  const handleLike = async () => {
    if (comment.userReaction?.type === ReactionType.LIKE) {
      await deleteReaction({
        commentId: comment.id,
        reactionId: comment.userReaction.id!,
      });
    } else if (comment.userReaction?.type === ReactionType.DISLIKE) {
      await updateReaction({
        commentId: comment.id,
        reactionId: comment.userReaction.id!,
        data: { type: ReactionType.LIKE },
      });
    } else {
      await createReaction({ commentId: comment.id, data: { type: ReactionType.LIKE } });
    }
  };

  const handleDislike = async () => {
    if (comment.userReaction?.type === ReactionType.DISLIKE) {
      await deleteReaction({
        commentId: comment.id,
        reactionId: comment.userReaction.id!,
      });
    } else if (comment.userReaction?.type === ReactionType.LIKE) {
      await updateReaction({
        commentId: comment.id,
        reactionId: comment.userReaction.id!,
        data: { type: ReactionType.DISLIKE },
      });
    } else {
      await createReaction({ commentId: comment.id, data: { type: ReactionType.DISLIKE } });
    }
  };

  return {
    handleLike,
    handleDislike,
    likesCount: comment.likesCount,
    dislikesCount: comment.dislikesCount,
    userReactionType: comment.userReaction?.type,
  };
};
