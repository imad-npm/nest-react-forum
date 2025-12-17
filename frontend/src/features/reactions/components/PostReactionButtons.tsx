import { ReactionButtons } from './ReactionButtons';
import { useCreatePostReactionMutation, useDeletePostReactionMutation, useUpdatePostReactionMutation } from '../services/reactionApi';
import type { Post } from '../../posts/types';
import { ReactionType } from '../types/types';

interface PostReactionButtonsProps {
    post: Post; // contains id, userReaction, likesCount, dislikesCount
}

export const PostReactionButtons: React.FC<PostReactionButtonsProps> = ({ post }) => {
    const [createReaction] = useCreatePostReactionMutation();
    const [deleteReaction] = useDeletePostReactionMutation();
    const [updateReaction] = useUpdatePostReactionMutation();

    const handleLike = async () => {
        if (post.userReaction?.type === ReactionType.LIKE) {
            await deleteReaction({ postId: post.id, reactionId: post.userReaction.id! });
        } else if (post.userReaction?.type === ReactionType.DISLIKE) {
            await updateReaction({ postId: post.id, reactionId: post.userReaction.id!, data: { type: ReactionType.LIKE } });
        }
        else {
            await createReaction({ postId: post.id, data: { type: ReactionType.LIKE } });
        }
    };

    const handleDislike = async () => {
        if (post.userReaction?.type === ReactionType.DISLIKE) {
            await deleteReaction({ postId: post.id, reactionId: post.userReaction.id! });
        } else if (post.userReaction?.type === ReactionType.LIKE) {
            await updateReaction({ postId: post.id, reactionId: post.userReaction.id!, data: { type: ReactionType.DISLIKE } });
        }
        else {
            await createReaction({ postId: post.id, data: { type: ReactionType.DISLIKE } });
        }
    };

    return (
        <ReactionButtons
            likesCount={post.likesCount}
            dislikesCount={post.dislikesCount}
            userReaction={post.userReaction?.type}
            onLike={handleLike}
            onDislike={handleDislike}
            disabled={false} // you can set loading state if needed
        />
    );
};
