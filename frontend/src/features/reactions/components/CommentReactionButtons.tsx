import { ReactionButtons } from './ReactionButtons';
import type { Comment } from '../../comments/types';
import { useCommentReactionButtons } from '../hooks/useCommentReactionButtons';

interface CommentReactionButtonsProps {
    comment: Comment;
}

export const CommentReactionButtons: React.FC<CommentReactionButtonsProps> = ({ comment }) => {
    const { handleLike, handleDislike, likesCount, dislikesCount, userReactionType } = useCommentReactionButtons({ comment });

    return (
        <ReactionButtons
            likesCount={likesCount}
            dislikesCount={dislikesCount}
            userReaction={userReactionType}
            onLike={handleLike}
            onDislike={handleDislike}
            disabled={false}
        />
    );
};
