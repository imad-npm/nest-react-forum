import type { Comment } from '../types';
import CommentCard from './CommentCard';
import { useComments } from '../hooks/useComments';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll';

interface CommentListProps {
  postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const {
    comments,
    isLoadingComments,
    pagination: { fetchNextPage, hasNextPage, isFetchingNextPage },
  } = useComments({ postId });

  const { sentinelRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoadingComments && !comments.length)
    return <div>Loading comments...</div>;
console.log(comments);

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
      <div ref={sentinelRef} />
      {isFetchingNextPage && <div className="p-4 text-center">Loading more comments...</div>}
    </div>
  );
};

export default CommentList;
