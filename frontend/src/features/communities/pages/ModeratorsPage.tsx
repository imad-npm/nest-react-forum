// frontend/src/features/communities/pages/mod/ModModeratorsPage.tsx
import { useParams } from 'react-router-dom';
import { useGetCommunityMembershipsQuery, useRemoveCommunityMemberMutation } from '../../community-memberships/services/communityMembershipsApi'; // Changed import
import { FaUserShield } from 'react-icons/fa';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../shared/components/ui/Button'; // Assuming Button component is available

export const ModModeratorsPage = () => {
  const { communityId } = useParams();
  const { user: currentUser } = useAuth(); // Get the current logged-in user
  const parsedCommunityId = Number(communityId);

  // Fetch all community memberships (including current user's)
  const { data: allMembershipsResponse, isLoading: isLoadingMemberships } = useGetCommunityMembershipsQuery({ communityId: parsedCommunityId, limit: 100 });

  // Filter for moderators (only 'moderator' role)
  const moderators = allMembershipsResponse?.data.filter(m => m.role === 'moderator');

  // Find the current user's membership in this community
  const currentUserMembership = allMembershipsResponse?.data.find(
    (member) => member.userId === currentUser?.id
  );

  const [removeCommunityMember, { isLoading: isRemovingMember }] = useRemoveCommunityMemberMutation(); // Changed hook and constant name

  const handleRemoveModerator = async (targetUserId: number) => {
    if (!communityId) return;
    try {
      await removeCommunityMember({ communityId: parsedCommunityId, targetUserId }).unwrap(); // Changed call
      // Optionally, add a success notification
    } catch (err) {
      console.error('Failed to remove member:', err);
      // Optionally, add an error notification
    }
  };

  if (isLoadingMemberships) return <div className="p-4">Loading moderation team...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
        <FaUserShield className="text-orange-600" />
        Moderation Team
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Moderator
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {moderators?.map((mod) => {
              // Determine if the current user can remove this moderator
              const canRemove = currentUser && currentUserMembership &&
                                currentUserMembership.userId !== mod.userId && // Cannot remove self
                                currentUserMembership.rank < mod.rank; // Can only remove mods with lower rank

              return (
                <tr key={mod.user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {/* Avatar Placeholder */}
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                          {mod.user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {mod.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {mod.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800`}>
                      {mod.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveModerator(mod.userId)}
                      disabled={isRemovingMember || !canRemove}
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};