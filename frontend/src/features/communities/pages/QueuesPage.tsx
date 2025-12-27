// frontend/src/features/communities/pages/mod/ModQueuesPage.tsx
import { useParams } from 'react-router-dom';
import { 
  
  
  useAcceptMembershipRequestMutation,
  useGetCommunityMembershipRequestsQuery,
  useRejectMembershipRequestMutation
} from '../../community-membership-requests/services/communityMembershipRequestsApi';
import { Button } from '../../../shared/components/ui/Button';

export const ModQueuesPage = () => {
  const { communityId } = useParams();
  const { data: requests, isLoading } = useGetCommunityMembershipRequestsQuery(Number(communityId));
  const [approve] = useAcceptMembershipRequestMutation();
  const [reject] = useRejectMembershipRequestMutation();

  if (isLoading) return <div className="p-4">Loading queue...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Moderation Queue: Join Requests</h2>
      {requests?.data.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <p className="text-gray-500 italic">No pending requests to review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests?.data.map((req) => (
            <div key={req.id} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <span className="font-medium text-gray-900 text-lg">User #{req.userId}</span>
                <p className="text-xs text-gray-500 italic">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => approve({communityId: req.communityId,
                  userId:req.userId})} className="bg-green-600 hover:bg-green-700">Approve</Button>
                <Button size="sm" variant="outline" onClick={() => reject({userId:req.userId ,communityId:req.communityId})} className="text-red-600 border-red-600 hover:bg-red-50">Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};