import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useGetProfileByUserIdQuery } from '../services/profileApi';
import { useGetPostsInfiniteQuery } from '../../posts/services/postsApi';
import { useGetCommentsInfiniteQuery } from '../../comments/services/commentsApi';

export const useProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const parsedUserId = Number(userId);

  const {
    data: profileResponse,
    isLoading,
    error,
    refetch,
  } = useGetProfileByUserIdQuery(parsedUserId);

  const { user: currentUser } = useAuth();

  const profile = profileResponse?.data;
  const isMyProfile = currentUser?.id === parsedUserId;


  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');

  const handleEditSuccess = () => {
    setIsEditing(false);
    refetch();
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  // Fetch Posts by User
  const {
    data: postsData,
    fetchNextPage: fetchNextPostsPage,
    hasNextPage: hasNextPostsPage,
    isFetchingNextPage: isFetchingNextPostsPage,
    isLoading: isLoadingPosts,
  } = useGetPostsInfiniteQuery({ authorId: parsedUserId });

  const posts = postsData?.pages.flatMap((page) => page.data) ?? [];

  // Fetch Comments by User
  const {
    data: commentsData,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
    isLoading: isLoadingComments,
  } = useGetCommentsInfiniteQuery({ authorId: parsedUserId });

  const comments = commentsData?.pages.flatMap((page) => page.data) ?? [];

  let errorMessage: string | null = null;
  if (error) {
    if ('status' in error && 'data' in error) {
      if (
        typeof error.data === 'object' &&
        error.data !== null &&
        'message' in error.data
      ) {
        errorMessage = (error.data as { message: string }).message;
      }
    } else if ('message' in error) {
      errorMessage = error.message ?? null;
    } else {
      errorMessage = 'Failed to load profile';
    }
  }

  return {
    profile,
    isLoading,
    error: errorMessage,
    isMyProfile,
    isEditing,
    setIsEditing,
    activeTab,
    setActiveTab,
    handleEditSuccess,
    handleEditCancel,
    posts: {
      data: posts,
      fetchNextPage: fetchNextPostsPage,
      hasNextPage: hasNextPostsPage,
      isFetchingNextPage: isFetchingNextPostsPage,
      isLoading: isLoadingPosts,
      total: postsData?.pages[0]?.meta?.totalItems ?? 0,
    },
    comments: {
      data: comments,
      fetchNextPage: fetchNextCommentsPage,
      hasNextPage: hasNextCommentsPage,
      isFetchingNextPage: isFetchingNextCommentsPage,
      isLoading: isLoadingComments,
      total: commentsData?.pages[0]?.meta?.totalItems ?? 0,
    },
  };
};
