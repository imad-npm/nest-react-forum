import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { ReactionButton } from './ReactionButton';
import type { ReactionTarget, ReactionType } from '../types/types';
import { useReactionButtons } from '../hooks/useReactionButtons';
import type { Post } from '../../posts/types';

import type { Comment } from '../../comments/types';

interface ReactionButtonsProps {
     target:Post |Comment
    disabled?: boolean;
    className?: string;
}


export const ReactionButtons: React.FC<ReactionButtonsProps> = ({
   target,
    disabled = false,
    className = '',
}) => {
    const { handleLike, handleDislike, likesCount,
        dislikesCount, userReactionType }
        = useReactionButtons({ target });

    return(
    <div className={`flex items-center space-x-3 ${className}`}>
        <ReactionButton
            count={likesCount}
            onClick={handleLike}
            disabled={disabled}
            type="like"
            userReaction={userReactionType}
        />

        <ReactionButton
            count={dislikesCount}
            onClick={handleDislike}
            disabled={disabled}
            type="dislike"
            userReaction={userReactionType}
        />
    </div>
    )
}

