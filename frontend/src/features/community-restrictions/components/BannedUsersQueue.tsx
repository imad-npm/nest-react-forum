import { Button } from "../../../shared/components/ui/Button";
import { useBannedUsers } from "../hooks/useBannedUsers";

export const BannedUsersQueue = () => {
  const { bannedUsers, isLoading, unbanUser } = useBannedUsers();

  if (isLoading) return <div className="p-4">Loading banned users...</div>;

  return (
    <div className="space-y-3">
      {bannedUsers.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <p className="text-gray-500 italic">
            No banned users in this community.
          </p>
        </div>
      ) : (
        bannedUsers.map((restriction) => (
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
                Banned on {new Date(restriction.createdAt).toLocaleDateString()}
                {restriction.expiresAt &&
                  ` - Expires on ${new Date(
                    restriction.expiresAt
                  ).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => unbanUser(restriction.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Unban
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
