import { useEffect, useRef, useCallback, useState } from 'react';
import { useGetPostsInfiniteQuery } from '../../posts/services/postsApi';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import type { PostQueryDto } from '../../posts/types';

export const useFeed = () => {
  const [queryParams] = useState<Omit<PostQueryDto, 'page'>>({
    limit: 10,
  });

  const {
    data,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useGetPostsInfiniteQuery(queryParams);

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const { showToast } = useToastContext();
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (error) {
      showToast('Failed to load posts', 'error');
    }
  }, [error, showToast]);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetching || !hasNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, hasNextPage, fetchNextPage]
  );

  return {
    posts,
    isLoading,
    isFetching,
    hasNextPage,
    error,
    lastPostElementRef,
  };
};
