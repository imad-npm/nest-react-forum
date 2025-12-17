import React from 'react';
import { ReactionButtons } from './ReactionButtons';
import { useCreateCommentReactionMutation, useDeleteCommentReactionMutation } from '../services/reactionApi';
import type { Comment } from '../../comments/types';

interface CommentReactionButtonsProps {
    comment: Comment; // contains id, userReaction, likesCount, dislikesCount
}

export const CommentReactionButtons: React.FC<CommentReactionButtonsProps> = ({ comment }) => {
    const [createReaction] = useCreateCommentReactionMutation();
    const [deleteReaction] = useDeleteCommentReactionMutation();

    const handleLike = async () => {
        if (comment.userReaction === 'like') {
            await deleteReaction({  reactionId: comment.userReactionId! });
        } else {
            await createReaction({ commentId: comment.id, data: { type: 'like' } });
        }
    };

    const handleDislike = async () => {
        if (comment.userReaction === 'dislike') {
            await deleteReaction({ reactionId: comment.userReactionId! });
        } else {
            await createReaction({ commentId: comment.id, data: { type: 'dislike' } });
        }
    };

    return (
        <ReactionButtons
            likesCount={comment.likesCount}
            dislikesCount={comment.dislikesCount}
            userReaction={comment.userReaction}
            onLike={handleLike}
            onDislike={handleDislike}
            disabled={false} // optionally handle loading state
        />
    );
};
