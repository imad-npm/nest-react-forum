// frontend/src/pages/ProfilePage.tsx
import { useState } from 'react'; // Import useState
import { useParams } from 'react-router-dom';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../auth/hooks/useAuth';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { useGetProfileByUserIdQuery } from '../services/profileApi';

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const parsedUserId = Number(userId);

  const { data: profileResponse, isLoading, error, refetch } = useGetProfileByUserIdQuery(parsedUserId); // Add refetch
  const { user: currentUser } = useAuth(); // Get current logged-in user

  console.log(currentUser);
  
  const profile = profileResponse?.data;
  const isMyProfile = currentUser?.id === parsedUserId;

  const [isEditing, setIsEditing] = useState(false); // State to control edit mode

  const handleEditSuccess = () => {
    setIsEditing(false);
    refetch(); // Refetch profile data after successful edit
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

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
      // You can check if 'data' is an object and has a message property
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
      {isEditing && isMyProfile ? (
        <ProfileEditForm
          currentProfile={profile}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      ) : (
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
      )}

      {/* TODO: Add more sections like user's posts, communities, etc. */}
    </div>
  );
};