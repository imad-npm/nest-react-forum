import { ReactionButtons } from './ReactionButtons';
import { useCreatePostReactionMutation, useDeletePostReactionMutation } from '../services/reactionApi';
import type { Post } from '../../posts/types';

interface PostReactionButtonsProps {
    post: Post; // contains id, userReaction, likesCount, dislikesCount
}

export const PostReactionButtons: React.FC<PostReactionButtonsProps> = ({ post }) => {
    const [createReaction] = useCreatePostReactionMutation();
    const [deleteReaction] = useDeletePostReactionMutation();

    const handleLike = async () => {
        if (post.userReaction === 'like') {
            await deleteReaction({ postId: post.id, reactionId: post.userReactionId! });
        } else {
            await createReaction({ postId: post.id, data: { type: 'like' } });
        }
    };

    const handleDislike = async () => {
        if (post.userReaction === 'dislike') {
            await deleteReaction({ postId: post.id, reactionId: post.userReactionId! });
        } else {
            await createReaction({ postId: post.id, data: { type: 'dislike' } });
        }
    };

    return (
        <ReactionButtons
            likesCount={post.likesCount}
            dislikesCount={post.dislikesCount}
            userReaction={post.userReaction}
            onLike={handleLike}
            onDislike={handleDislike}
            disabled={false} // you can set loading state if needed
        />
    );
};
