import React, { useState, useCallback } from 'react';
import { ReactionButtons } from './ReactionButtons';
import { useUpdateCommentReactionMutation, useCreateCommentReactionMutation, useDeleteCommentReactionMutation } from '../services/reactionApi';
import type { Comment } from '../../comments/types';
import { ReactionType } from '../types/types';


interface CommentReactionButtonsProps {
    comment: Comment; // contains id, userReaction, userReactionId, likesCount, dislikesCount
}

export const CommentReactionButtons: React.FC<CommentReactionButtonsProps> = ({ comment }) => {
    const [updateReaction] = useUpdateCommentReactionMutation();
    const [createReaction] = useCreateCommentReactionMutation();
    const [deleteReaction] = useDeleteCommentReactionMutation();
    const [isLoading, setIsLoading] = useState(false);

    const handleReaction = useCallback(async (type: ReactionType) => {
        setIsLoading(true);

        try {
            // Case 1: Clicking the same reaction type - remove it
            if (comment.userReaction?.type === type && comment.userReaction?.id) {
                await deleteReaction({ commentId: comment.id, reactionId: comment.userReaction.id }).unwrap();
            }
            // Case 2: Switching reaction type (like ↔ dislike) - update existing
            else if (comment.userReaction && comment.userReaction.type !== type && comment.userReaction.id) {
                await updateReaction({
                    commentId: comment.id,
                    reactionId: comment.userReaction.id,
                    data: { type }
                }).unwrap();
            }
            // Case 3: No existing reaction - create new
            else {
                await createReaction({
                    commentId: comment.id,
                    data: { type }
                }).unwrap();
            }
        } catch (error) {
            console.error('Failed to update reaction:', error);
        } finally {
            setIsLoading(false);
        }
    }, [comment.userReaction, comment.id, updateReaction, createReaction, deleteReaction]);

    const handleLike = () => handleReaction(ReactionType.LIKE);
    const handleDislike = () => handleReaction(ReactionType.DISLIKE);

    return (
        <ReactionButtons
            likesCount={comment.likesCount}
            dislikesCount={comment.dislikesCount}
            userReaction={comment.userReaction?.type}
            onLike={handleLike}
            onDislike={handleDislike}
            disabled={isLoading}
        />
    );
};