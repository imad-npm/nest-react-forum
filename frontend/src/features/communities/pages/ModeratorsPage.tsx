// frontend/src/features/communities/pages/mod/ModModeratorsPage.tsx
import { useParams } from 'react-router-dom';
import { useGetCommunityMembershipsQuery } from '../../community-memberships/services/communityMembershipsApi';
import { FaUserShield } from 'react-icons/fa';

export const ModModeratorsPage = () => {
  const { communityId } = useParams();
  const { data: response, isLoading } = useGetCommunityMembershipsQuery({ communityId: Number(communityId) });

  const moderators = response?.data.filter(m => m.role === 'admin' || m.role === 'moderator');

  if (isLoading) return <div className="p-4">Loading moderation team...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
        <FaUserShield className="text-orange-600" />
        Moderation Team
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {moderators?.map((mod) => (
          <div key={mod.userId} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 font-black ${
              mod.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {mod.role[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">User #{mod.userId}</p>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{mod.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};