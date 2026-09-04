import { useNavigate } from 'react-router-dom';

import {
  useCreateReactionMutation,
  useDeleteReactionMutation,
  useUpdateReactionMutation,
} from '../services/reactionApi';

import { Reactable, ReactionType, type ReactableEntity } from '../types/types';
import { useAuth } from '../../auth/hooks/useAuth';

interface UseReactionButtonsProps {
  target: ReactableEntity;
}

export const useReactionButtons = ({
  target
}: UseReactionButtonsProps) => {
  const navigate = useNavigate();

  const [createReaction] = useCreateReactionMutation();
  const [deleteReaction] = useDeleteReactionMutation();
  const [updateReaction] = useUpdateReactionMutation();

  const reactableType =
    'title' in target ? Reactable.POST : Reactable.COMMENT;

    const {user:currentUser}=useAuth()
  const requireAuth = () => {
    if (!currentUser) {
      navigate('/login');
      return false;
    }

    return true;
  };

  const handleLike = async () => {
    if (!requireAuth()) return;

    if (target.userReaction?.type === ReactionType.LIKE) {
      await deleteReaction({
        id: target.userReaction.id!,
        reactableType,
      });
      return;
    }

    if (target.userReaction?.type === ReactionType.DISLIKE) {
      await updateReaction({
        id: target.userReaction.id!,
        data: {
          type: ReactionType.LIKE,
        },
        reactableType,
      });
      return;
    }

    await createReaction({
      type: ReactionType.LIKE,
      reactableType,
      reactableId: target.id,
    });
  };

  const handleDislike = async () => {
    if (!requireAuth()) return;

    if (target.userReaction?.type === ReactionType.DISLIKE) {
      await deleteReaction({
        id: target.userReaction.id!,
        reactableType,
      });
      return;
    }

    if (target.userReaction?.type === ReactionType.LIKE) {
      await updateReaction({
        id: target.userReaction.id!,
        data: {
          type: ReactionType.DISLIKE,
        },
        reactableType,
      });
      return;
    }

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