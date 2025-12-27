import { useParams } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { CommunityRestrictionType } from '../../community-restrictions/types';
import {
  useGetCommunityRestrictionsQuery,
  useDeleteCommunityRestrictionMutation,
} from '../../community-restrictions/services/communityRestrictionsApi.ts'

export const RestrictedUsersPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { data: response, isLoading } = useGetCommunityRestrictionsQuery({
    communityId: Number(communityId),
    page: 1,
    limit: 50,
  });
  const [removeRestriction] = useDeleteCommunityRestrictionMutation();

  if (isLoading) return <div className="p-4">Loading restricted users...</div>;

  const restrictions = response?.data ?? [];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Restricted Users</h2>

      {restrictions.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <p className="text-gray-500 italic">No users are currently restricted.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {restrictions.map((r) => (
            <div
              key={r.id}
              className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200"
            >
              <div>
                <span className="font-medium text-gray-900 text-lg">User #{r.userId}</span>
                <p className="text-sm text-gray-500">
                  Restriction: {r.restrictionType === CommunityRestrictionType.BAN ? 'Ban' : 'Mute'}
                </p>
                {r.reason && <p className="text-xs italic text-gray-400">Reason: {r.reason}</p>}
                <p className="text-xs text-gray-400">
                  Expires: {r.expiresAt ? new Date(r.expiresAt).toLocaleString() : 'Never'}
                </p>
              </div>
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeRestriction(r.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Remove Restriction
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

