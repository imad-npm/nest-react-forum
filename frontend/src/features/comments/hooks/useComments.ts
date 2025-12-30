import { useState, useMemo } from 'react';
import {
  useCreateCommentMutation,
  useGetCommentsInfiniteQuery,
} from '../services/commentsApi';
import { useToastContext } from '../../../shared/providers/ToastProvider';

interface UseCommentsProps {
  postId: number;
  parentId?: number;
}

export const useComments = ({ postId, parentId }: UseCommentsProps) => {
  const [content, setContent] = useState('');
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const { showToast } = useToastContext();

  const {
    data: paginatedData,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
    refetch,
    fetchNextPage, // Directly use fetchNextPage from the infinite query hook
    hasNextPage,
  } = useGetCommentsInfiniteQuery(
    { postId, parentId, limit: 10 }, // No 'page' in queryArg, it's handled by infiniteQuery
    {
      // pollingInterval: 30000,
      // refetchOnMountOrArgChange: true,
    }
  );

  const comments = useMemo(
    () => paginatedData?.pages.flatMap((page) => page.data) ?? [],
    [paginatedData?.pages]
  );
  const meta = useMemo(
    () => paginatedData?.pages[paginatedData.pages.length - 1]?.meta,
    [paginatedData?.pages]
  );

  const handleCreateComment = async (
    onCommentPosted?: () => void,
    commentContent?: string
  ) => {
    const finalContent = commentContent || content;
    if (!finalContent.trim()) {
      showToast('Comment cannot be empty', 'error');
      return;
    }

    try {
      await createComment({
        postId,
        data: { content: finalContent, parentId },
      }).unwrap();
      setContent('');
      showToast('Comment posted successfully', 'success');
      onCommentPosted?.();
      refetch();
    } catch (error: any) {
      const errorMessage =
        error.data?.message || error.message || 'Failed to post comment';
      showToast(errorMessage, 'error');
    }
  };

  return {
    content,
    setContent,
    handleCreateComment,
    isCreating,
    comments,
    isLoadingComments,
    isFetchingComments,
    refetchComments: refetch,
    pagination: {
      fetchNextPage, // Directly expose fetchNextPage
      hasNextPage,
      isFetchingNextPage: isFetchingComments && hasNextPage, // Adjusted logic for isFetchingNextPage
    },
  };
};
