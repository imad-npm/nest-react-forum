import { ReactionButtons } from './ReactionButtons';
import { useCreateCommentReactionMutation, useDeleteCommentReactionMutation, useUpdateCommentReactionMutation } from '../services/reactionApi';
import type { Comment } from '../../comments/types'; // Import Comment type
import { ReactionType } from '../types/types';

interface CommentReactionButtonsProps {
    comment: Comment; // contains id, userReaction, likesCount, dislikesCount
}

export const CommentReactionButtons: React.FC<CommentReactionButtonsProps> = ({ comment }) => {
    const [createReaction] = useCreateCommentReactionMutation();
    const [deleteReaction] = useDeleteCommentReactionMutation();
    const [updateReaction] = useUpdateCommentReactionMutation();

    const handleLike = async () => {
        if (comment.userReaction?.type === ReactionType.LIKE) {
            await deleteReaction({ commentId: comment.id, reactionId: comment.userReaction.id! });
        } else if (comment.userReaction?.type === ReactionType.DISLIKE) {
            await updateReaction({ commentId: comment.id, reactionId: comment.userReaction.id!, data: { type: ReactionType.LIKE } });
        }
        else {
            await createReaction({ commentId: comment.id, data: { type: ReactionType.LIKE } });
        }
    };

    const handleDislike = async () => {
        if (comment.userReaction?.type === ReactionType.DISLIKE) {
            await deleteReaction({ commentId: comment.id, reactionId: comment.userReaction.id! });
        } else if (comment.userReaction?.type === ReactionType.LIKE) {
            await updateReaction({ commentId: comment.id, reactionId: comment.userReaction.id!, data: { type: ReactionType.DISLIKE } });
        }
        else {
            await createReaction({ commentId: comment.id, data: { type: ReactionType.DISLIKE } });
        }
    };

    return (
        <ReactionButtons
            likesCount={comment.likesCount}
            dislikesCount={comment.dislikesCount}
            userReaction={comment.userReaction?.type}
            onLike={handleLike}
            onDislike={handleDislike}
            disabled={false} // you can set loading state if needed
        />
    );
};
