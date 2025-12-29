import { Button } from '../../../shared/components/ui/Button';
import CommentCard from './CommentCard';
import type { Comment } from '../types'; // Import Comment type
 // Import Comment type

interface CommentListProps {
    comments: Comment[]; // Accept comments as a prop
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isLoading?: boolean; // Optional loading state from parent
}

const CommentList: React.FC<CommentListProps> = ({
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
}) => {
    if (isLoading) return <div>Loading comments...</div>;
console.log(comments);

    return (
        <div className="space-y-4">
            {comments.length === 0 ? (
                <p>No comments found.</p>
            ) : (
                comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} level={0} postId={comment.postId} />
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

export default CommentList;
