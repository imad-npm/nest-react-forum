// frontend/src/features/communities/pages/mod/ModMembersPage.tsx
import { useParams } from 'react-router-dom';
import { useGetCommunityMembershipsQuery } from '../../community-memberships/services/communityMembershipsApi';

export const ModMembersPage = () => {
  const { communityId } = useParams();
  const { data: response, isLoading } = useGetCommunityMembershipsQuery({ communityId: Number(communityId) });

  if (isLoading) return <div className="p-4 text-center">Loading members...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Community Members</h2>
        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 font-medium font-bold">
          Total: {response?.data.length || 0}
        </span>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {response?.data.map((membership) => (
              <tr key={membership.userId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User #{membership.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    membership.role === 'admin' ? 'bg-red-100 text-red-800' : 
                    membership.role === 'moderator' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {membership.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {new Date(membership.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};