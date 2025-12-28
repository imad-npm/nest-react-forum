// frontend/src/pages/ProfilePage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../auth/hooks/useAuth';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { useGetProfileByUserIdQuery } from '../services/profileApi';
import { Modal } from '../../../shared/components/ui/Modal';
import { useGetPostsInfiniteQuery } from '../../posts/services/postsApi';
import { useGetCommentsInfiniteQuery } from '../../comments/services/commentsApi';
import UserCommentList from '../../comments/components/UserCommentList'; // NEW IMPORT
import { Button } from '../../../shared/components/ui/Button';
import PostList from '../../posts/components/PostList';

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const parsedUserId = Number(userId);
  
  const { data: profileResponse, isLoading, error, refetch } = useGetProfileByUserIdQuery(parsedUserId);
  const { user: currentUser } = useAuth();

  console.log(profileResponse,parsedUserId);
  
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
  } = useGetPostsInfiniteQuery({ authorId: parsedUserId } );

  const posts = postsData?.pages.flatMap(page => page.data) ?? [];

  // Fetch Comments by User
  const {
    data: commentsData,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
    isLoading: isLoadingComments,
  } = useGetCommentsInfiniteQuery({ queryArg: { authorId: parsedUserId } });

  const comments = commentsData?.pages.flatMap(page => page.data) ?? [];


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    let errorMessage = 'Failed to load profile';
    if ('status' in error && 'data' in error) {
      if (typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
        errorMessage = (error.data as { message: string }).message;
      }
    } else if ('message' in error) {
      errorMessage = error.message;
    }

    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {errorMessage}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      {/* Profile Display Section */}
      <>
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {profile.picture ? (
              <img
                className="h-24 w-24 rounded-full object-cover border-4 border-blue-300"
                src={profile.picture}
                alt={`${profile.username}'s profile picture`}
              />
            ) : (
              <FaUserCircle className="h-24 w-24 text-gray-400 border-4 border-blue-300 rounded-full p-1" />
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{profile.username}</h1>
            <p className="text-gray-600 text-lg">{profile.user.email}</p>
            {isMyProfile && (
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-semibold text-gray-800">About Me</h2>
          <p className="mt-4 text-gray-700">
            {profile.bio || 'No biography available yet.'}
          </p>
        </div>
      </>

      {/* Profile Edit Modal */}
      {isMyProfile && (
        <Modal
          open={isEditing}
          onClose={handleEditCancel}
        >
          <ProfileEditForm
            currentProfile={profile}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </Modal>
      )}

      {/* Posts and Comments Sections */}
      <div className="mt-8 border-t pt-6">
        <div className="flex space-x-4 mb-4">
          <Button
            variant={activeTab === 'posts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('posts')}
          >
            Posts ({postsData?.pages[0]?.meta?.total ?? 0})
          </Button>
          <Button
            variant={activeTab === 'comments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('comments')}
          >
            Comments ({commentsData?.pages[0]?.meta?.total ?? 0})
          </Button>
        </div>

        {activeTab === 'posts' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posts</h2>
            {isLoadingPosts ? (
              <p>Loading posts...</p>
            ) : posts.length > 0 ? (
              <>
                <PostList posts={posts} isLoading={false} error={undefined} />
                {hasNextPostsPage && (
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => fetchNextPostsPage()} disabled={isFetchingNextPostsPage}>
                      {isFetchingNextPostsPage ? 'Loading more...' : 'Load More Posts'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>No posts found.</p>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
            {isLoadingComments ? (
              <p>Loading comments...</p>
            ) : comments.length > 0 ? (
              <>
                <UserCommentList // Use UserCommentList
                  comments={comments}
                  fetchNextPage={fetchNextCommentsPage}
                  hasNextPage={hasNextCommentsPage}
                  isFetchingNextPage={isFetchingNextCommentsPage}
                  isLoading={isLoadingComments}
                />
                {hasNextCommentsPage && (
                  <div className="flex justify-center mt-4">
                    <Button onClick={() => fetchNextCommentsPage()} disabled={isFetchingNextCommentsPage}>
                      {isFetchingNextCommentsPage ? 'Loading more...' : 'Load More Comments'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p>No comments found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};