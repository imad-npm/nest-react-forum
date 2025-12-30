import { Button } from "../../../shared/components/ui/Button";
import { useMutedUsers } from "../hooks/useMutedUsers";

export const MutedUsersQueue = () => {
  const { mutedUsers, isLoading, unmuteUser } = useMutedUsers();

  if (isLoading) return <div className="p-4">Loading muted users...</div>;

  return (
    <div className="space-y-3">
      {mutedUsers.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <p className="text-gray-500 italic">
            No muted users in this community.
          </p>
        </div>
      ) : (
        mutedUsers.map((restriction) => (
          <div
            key={restriction.id}
            className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200"
          >
            <div>
              <p className="font-medium text-gray-900 text-lg">
                {restriction.user.username}
              </p>
              <p className="text-sm text-gray-700">{restriction.reason}</p>
              <p className="text-xs text-gray-500 italic">
                Muted on {new Date(restriction.createdAt).toLocaleDateString()}
                {restriction.expiresAt &&
                  ` - Expires on ${new Date(
                    restriction.expiresAt
                  ).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => unmuteUser(restriction.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Unmute
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
