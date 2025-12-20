import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { ReactionButton } from './ReactionButton';
import type { ReactionType } from '../types/types';

interface ReactionButtonsProps {
    likesCount: number;
    dislikesCount: number;
    userReaction: ReactionType | null | undefined;
    onLike: () => void;
    onDislike: () => void;
    disabled?: boolean;
    className?: string;
}

export const ReactionButtons: React.FC<ReactionButtonsProps> = ({
    likesCount,
    dislikesCount,
    userReaction,
    onLike,
    onDislike,
    disabled = false,
    className = '',
}) => (
    <div className={`flex items-center space-x-3 ${className}`}>
        <ReactionButton
            count={likesCount}
            onClick={onLike}
            disabled={disabled}
            type="like"
            userReaction={userReaction}
        />

        <ReactionButton
            count={dislikesCount}
            onClick={onDislike}
            disabled={disabled}
            type="dislike"
            userReaction={userReaction}
        />
    </div>
);
