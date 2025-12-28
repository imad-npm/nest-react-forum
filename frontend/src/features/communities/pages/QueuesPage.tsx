// frontend/src/features/communities/pages/mod/ModQueuesPage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAcceptMembershipRequestMutation, useGetCommunityMembershipRequestsQuery, useRejectMembershipRequestMutation } from '../../community-membership-requests/services/communityMembershipRequestsApi';
import { Button } from '../../../shared/components/ui/Button';
import { CommunityMembershipRequestStatus } from '../../community-membership-requests/types';
import { ReportsQueue } from '../../reports/components/ReportsQueue';
import { PendingPostsQueue } from '../../posts/components/PendingPostsQueue';
import { RejectedPostsQueue } from '../../posts/components/RejectedPostsQueue';

const JoinRequestsQueue = () => {
  const { communityId } = useParams();
  const { data:requests, isLoading } = useGetCommunityMembershipRequestsQuery({
    communityId: +communityId,
    status: CommunityMembershipRequestStatus.PENDING,
    page: 1,
    limit: 10,
  });
  const [approve] = useAcceptMembershipRequestMutation();
  const [reject] = useRejectMembershipRequestMutation();

  if (isLoading) return <div className="p-4">Loading queue...</div>;

  return (
    <>
      {requests?.data.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <p className="text-gray-500 italic">No pending requests to review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests?.data.map((req) => (
            <div key={req.id} className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex-shrink-0 mr-4">
                {/* Placeholder for avatar - could be replaced with actual avatar later */}
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {req.user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-grow">
                <a href={`/profile/${req.userId}`} className="font-medium text-blue-600 hover:underline text-lg">
                  {req.user.name}
                </a>
                <p className="text-xs text-gray-500 italic">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => approve({communityId: req.communityId,
                  userId:req.userId})} className="bg-green-600 hover:bg-green-700 rounded-full">Approve</Button>
                <Button size="sm" variant="outline" onClick={() => reject({userId:req.userId ,communityId:req.communityId})} className="text-red-600 border-red-600 hover:bg-red-50 rounded-full">Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export const ModQueuesPage = () => {
  const [activeTab, setActiveTab] = useState('join-requests');

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Moderation Queues</h2>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('join-requests')}
            className={`${
              activeTab === 'join-requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Join Requests
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('pending-posts')}
            className={`${
              activeTab === 'pending-posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending Posts
          </button>
          <button
            onClick={() => setActiveTab('rejected-posts')}
            className={`${
              activeTab === 'rejected-posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Rejected Posts
          </button>
        </nav>
      </div>

      <div className="py-6">
        {activeTab === 'join-requests' && <JoinRequestsQueue />}
        {activeTab === 'reports' && <ReportsQueue />}
        {activeTab === 'pending-posts' && <PendingPostsQueue />}
        {activeTab === 'rejected-posts' && <RejectedPostsQueue />}
      </div>
    </div>
  );
};