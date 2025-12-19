import { Button } from '../../../shared/components/ui/Button';
import { useGetCommentsByPostIdInfiniteQuery } from '../services/commentsApi';
import CommentCard from './CommentCard';

interface CommentListProps {
    postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
    const {
        data,
        error,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetCommentsByPostIdInfiniteQuery(
        { postId, limit: 10 }, // Pass postId and queryArg with limit
    );

    const allComments = data?.pages?.flatMap((page) => page.data) || [];

    if (isLoading) return <div>Loading comments...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="space-y-4">
            {allComments.length === 0 ? (
                <p>No comments yet. Be the first to comment!</p>
            ) : (
                allComments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))
            )}
            {hasNextPage && (
                <div className="flex justify-center mt-4">
                    <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CommentList;
