import type { Comment } from '../types';
import { Button } from '../../../shared/components/ui/Button';
import CommentCard from './CommentCard';
import { useComments } from '../hooks/useComments';

interface CommentListProps {
  postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const {
    comments,
    isLoadingComments,
    pagination: { fetchNextPage, hasNextPage, isFetchingNextPage },
  } = useComments({ postId });

  if (isLoadingComments && !comments.length)
    return <div>Loading comments...</div>;

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        comments.map((comment: Comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            level={0}
            postId={comment.postId}
          />
        ))
      )}
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button onClick={fetchNextPage} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : 'Load More Comments'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
