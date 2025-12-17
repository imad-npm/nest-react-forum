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
            active={userReaction === 'like'}
            count={likesCount}
            icon={<FaThumbsUp className={userReaction === 'like' ? 'fill-blue-600' : 'fill-gray-400'} />}
            onClick={onLike}
            disabled={disabled}
            type="like"
            ariaLabel={userReaction === 'like' ? 'Remove like' : 'Like'}
        />

        <ReactionButton
            active={userReaction === 'dislike'}
            count={dislikesCount}
            icon={<FaThumbsDown className={userReaction === 'dislike' ? 'fill-red-600' : 'fill-gray-400'} />}
            onClick={onDislike}
            disabled={disabled}
            type="dislike"
            ariaLabel={userReaction === 'dislike' ? 'Remove dislike' : 'Dislike'}
        />
    </div>
);
