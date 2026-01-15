import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaUserShield, FaUserTimes, FaBan } from 'react-icons/fa';
import { Button } from '../../../shared/components/ui/Button';
import Dropdown from '../../../shared/components/ui/Dropdown';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import type { CommunityMembership } from '../types';
import { useRemoveCommunityMemberMutation } from '../services/communityMembershipsApi';

// Assuming these are your API hooks based on the project structure


interface MembershipActionsProps {
  membership : CommunityMembership
}

const MembershipActions: React.FC<MembershipActionsProps> = ({ membership }) => {
  const { showToast } = useToastContext();
  const member=membership.user ;
  const communityId=membership.communityId
  
  // RTK Query Mutations
  const [updateRole, { isLoading: isUpdating }] = useUpdateMemberRoleMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveCommunityMemberMutation();
  const [banMember, { isLoading: isBanning }] = useBanMemberMutation();

  const isBusy = isUpdating || isRemoving || isBanning;

  const handlePromote = async () => {
    try {
      await updateRole({ 
        communityId, 
        userId: member.id, 
        role: 'moderator' 
      }).unwrap();
      showToast(`${member.username} promoted to moderator`, 'success');
    } catch (err) {
      showToast('Failed to promote member', 'error');
    }
  };

  const handleRemove = async () => {
    if (!window.confirm(`Remove ${member.username} from community?`)) return;
    try {
      await removeMember({ communityId, userId: member.id }).unwrap();
      showToast('Member removed', 'success');
    } catch (err) {
      showToast('Failed to remove member', 'error');
    }
  };

  const handleBan = async () => {
    if (!window.confirm(`Permanently ban ${member?.username}?`)) return;
    try {
      await banMember({ communityId, userId: member.id }).unwrap();
      showToast('User has been banned', 'success');
    } catch (err) {
      showToast('Failed to ban user', 'error');
    }
  };

  return (
    <Dropdown
      trigger={
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={isBusy}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <BsThreeDotsVertical className={isBusy ? 'animate-pulse' : 'text-gray-500'} />
        </Button>
      }
      align="right"
    >
      <div className="py-1 min-w-[160px] bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-md">
        {membership.role !== 'moderator' && (
          <button
            onClick={handlePromote}
            disabled={isBusy}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaUserShield className="mr-2 text-blue-500" /> Promote to Mod
          </button>
        )}
        
        <button
          onClick={handleRemove}
          disabled={isBusy}
          className="flex items-center w-full px-4 py-2 text-sm text-amber-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaUserTimes className="mr-2" /> Remove Member
        </button>

        <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

        <button
          onClick={handleBan}
          disabled={isBusy}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
        >
          <FaBan className="mr-2" /> Ban User
        </button>
      </div>
    </Dropdown>
  );
};

export default MembershipActions;

function useUpdateMemberRoleMutation() {
}


function useRemoveMemberMutation() {
}


function useBanMemberMutation() {
}
