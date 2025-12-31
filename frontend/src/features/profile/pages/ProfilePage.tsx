import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { Modal } from '../../../shared/components/ui/Modal';
import UserCommentList from '../../comments/components/UserCommentList';
import { Button } from '../../../shared/components/ui/Button';
import PostList from '../../posts/components/PostList';
import { useProfile } from '../hooks/useProfilePage';

export const ProfilePage = () => {
  const {
    profile,
    isLoading,
    error,
    isMyProfile,
    isEditing,
    setIsEditing,
    activeTab,
    setActiveTab,
    handleEditSuccess,
    handleEditCancel,
    posts,
    comments,
  } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
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
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white border border-gray-300 rounded-lg">
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
            <h1 className="text-4xl font-bold text-gray-800">
              {profile.username}
            </h1>
            <p className="text-gray-600 text-lg">{profile.user.email}</p>
            {isMyProfile && (
              <Button
              
                onClick={() => setIsEditing(true)}
              >
                <FaEdit />
                <span className='mx-2'>Edit Profile</span>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-300 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800">About Me</h2>
          <p className="mt-4 text-gray-700">
            {profile.bio || 'No biography available yet.'}
          </p>
        </div>
      </>

      {/* Profile Edit Modal */}
      {isMyProfile && (
        <Modal open={isEditing} onClose={handleEditCancel}>
          <ProfileEditForm
            currentProfile={profile}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </Modal>
      )}

      {/* Posts and Comments Sections */}
      <div className="mt-8 border-t border-gray-300 pt-6">
        <div className="flex space-x-4 mb-4">
          <Button
            variant={activeTab === 'posts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('posts')}
          >
            Posts ({posts.total})
          </Button>
          <Button
            variant={activeTab === 'comments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('comments')}
          >
            Comments ({comments.total})
          </Button>
        </div>

        {activeTab === 'posts' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Posts
            </h2>
            {posts.isLoading ? (
              <p>Loading posts...</p>
            ) : posts.data.length > 0 ? (
              <>
                <PostList
                  posts={posts.data}
                  isLoading={false}
                  error={undefined}
                />
                {posts.hasNextPage && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => posts.fetchNextPage()}
                      disabled={posts.isFetchingNextPage}
                    >
                      {posts.isFetchingNextPage
                        ? 'Loading more...'
                        : 'Load More Posts'}
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Comments
            </h2>
            {comments.isLoading ? (
              <p>Loading comments...</p>
            ) : comments.data.length > 0 ? (
              <>
                <UserCommentList // Use UserCommentList
                  comments={comments.data}
                  fetchNextPage={comments.fetchNextPage}
                  hasNextPage={comments.hasNextPage}
                  isFetchingNextPage={comments.isFetchingNextPage}
                  isLoading={comments.isLoading}
                />
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