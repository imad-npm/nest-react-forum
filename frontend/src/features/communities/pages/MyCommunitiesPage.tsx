import React from 'react';
import { useGetCommunitySubscriptionsQuery } from '../../community-subscriptions/services/communitySubscriptionsApi';
import CommunityCard from '../components/CommunityCard'; // Assuming a CommunityCard component exists
import type { CommunitySubscription } from '../../community-subscriptions/types';
import type { Community } from '../types';
import { useAuth } from '../../auth/hooks/useAuth';

const MyCommunitiesPage: React.FC = () => {
  const { user } = useAuth(); // Get current user from auth context/hook

  const { data, isLoading, isError, error } = useGetCommunitySubscriptionsQuery(
    {
      userId: user?.id,
      limit: 100, // Fetch a reasonable number of subscriptions
    },
    { skip: !user?.id } // Skip query if user ID is not available
  );

  if (isLoading) {
    return <div className="text-center mt-8">Loading your communities...</div>;
  }

  if (isError) {
    console.error("Error loading my communities:", error);
    return <div className="text-center mt-8 text-red-500">Error loading your communities.</div>;
  }

  const subscriptions: CommunitySubscription[] = data?.data || [];
  const myCommunities: Community[] = subscriptions.map(sub => sub.community).filter(Boolean) as Community[];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Communities</h1>

      {myCommunities.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg mb-4">You haven't joined any communities yet.</p>
          <p className="text-gray-500">Explore communities to find ones that interest you!</p>
          {/* TODO: Add a link to the Explore Communities page here */}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {myCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCommunitiesPage;
