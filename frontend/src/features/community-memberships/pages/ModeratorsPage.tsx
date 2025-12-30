import { FaUserShield } from 'react-icons/fa';
import { Button } from '../../../shared/components/ui/Button';
import { useModerators } from '../hooks/useModerators';

export const ModeratorsPage = () => {
  const {
    moderators,
    isLoading,
    isRemovingMember,
    canRemoveModerator,
    handleRemoveModerator,
  } = useModerators();

  if (isLoading) return <div className="p-4">Loading moderation team...</div>;

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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Moderator
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {moderators.map((mod) => {
              const canRemove = canRemoveModerator(mod);

              return (
                <tr key={mod.user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {/* Avatar Placeholder */}
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                          {mod.user.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {mod.user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {mod.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800`}
                    >
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