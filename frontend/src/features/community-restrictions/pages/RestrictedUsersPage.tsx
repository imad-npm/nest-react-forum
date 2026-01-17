import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { CommunityRestrictionType, type CommunityRestriction } from '../../community-restrictions/types';
import {
  useGetCommunityRestrictionsInfiniteQuery,
  useDeleteCommunityRestrictionMutation,
} from '../../community-restrictions/services/communityRestrictionsApi.ts';
import { Modal } from '../../../shared/components/ui/Modal';
import { CreateRestrictionForm } from '../../community-restrictions/components/CreateRestrictionForm';
import { useInfiniteScroll } from '../../../shared/hooks/useInfiniteScroll.ts';

export const RestrictedUsersPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { data: response, isLoading, fetchNextPage,
        hasNextPage,
        isFetchingNextPage, refetch } = useGetCommunityRestrictionsInfiniteQuery({
    communityId: Number(communityId),
  
  });
  const [removeRestriction] = useDeleteCommunityRestrictionMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);


    const { sentinelRef } = useInfiniteScroll({
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      });

  const handleRestrictionCreated = () => {
    setIsModalOpen(false);
    refetch(); // Refetch restrictions to update the list
  };

  if (isLoading) return <div className="p-4">Loading restricted users...</div>;

  const restrictions = response?.pages.flatMap((page) => page.data) ?? [];

  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Restricted Users</h2>
        <Button onClick={() => setIsModalOpen(true)}>Create Restriction</Button>
      </div>

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
                <span className="font-medium text-gray-900 text-lg">{r.user.username}</span>
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
                  variant="destructive"
                  onClick={() => removeRestriction(r.id)}
                >
                  Remove Restriction
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal  open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateRestrictionForm
          communityId={Number(communityId)}
          onSuccess={handleRestrictionCreated}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

        <div ref={sentinelRef} />
      {isFetchingNextPage && <div className="p-4 text-center">Loading more comments...</div>}
    </div>
  );
};
