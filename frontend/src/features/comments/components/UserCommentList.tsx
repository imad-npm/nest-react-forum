import { Button } from '../../../shared/components/ui/Button';
import UserCommentCard from './UserCommentCard'; // Import the new UserCommentCard
import type { Comment } from '../types'; // Import Comment type

interface UserCommentListProps {
    comments: Comment[]; // Accept comments as a prop
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isLoading?: boolean; // Optional loading state from parent
}

const UserCommentList: React.FC<UserCommentListProps> = ({
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
}) => {
    if (isLoading) return <div>Loading comments...</div>;

    return (
        <div className="space-y-4">
            {comments.length === 0 ? (
                <p>No comments found.</p>
            ) : (
                comments.map((comment) => (
                    // Render UserCommentCard instead of CommentCard
                    <UserCommentCard key={comment.id} comment={comment} />
                ))
            )}
            {hasNextPage && (
                <div className="flex justify-center mt-4">
                    <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? 'Loading more...' : 'Load More Comments'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UserCommentList;
