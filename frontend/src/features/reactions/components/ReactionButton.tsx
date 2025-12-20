import React from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

interface ReactionButtonProps {

    onClick: () => void;
    count?: number; // optional count
    disabled?: boolean;
    type: 'like' | 'dislike';
    userReaction?: 'like' | 'dislike' | null;
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
    onClick,
    count = 0,
    disabled = false,
    type,
    userReaction,
}) => {
  const isActive = userReaction === type;
    const ariaLabel = userReaction === 'like' ? 'Remove like' : 'Like'

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size='sm'
            variant='secondary'

            aria-label={ariaLabel ?? type}
        >
                 {type === 'like' ? (
        isActive ? <FaThumbsUp /> : <FaRegThumbsUp />
      ) : isActive ? (
        <FaThumbsDown />
      ) : (
        <FaRegThumbsDown />
      )}
            
            {count > 0 && <span className="text-sm ms-2 font-medium">{count}</span>}
        </Button>
    );
};
