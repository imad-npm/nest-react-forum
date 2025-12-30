import { ReactionButtons } from './ReactionButtons';
import type { Post } from '../../posts/types';
import { usePostReactionButtons } from '../hooks/usePostReactionButtons';

interface PostReactionButtonsProps {
    post: Post;
}

export const PostReactionButtons: React.FC<PostReactionButtonsProps> = ({ post }) => {
    const { handleLike, handleDislike, likesCount, dislikesCount, userReactionType } = usePostReactionButtons({ post });

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
