import { FaShare } from 'react-icons/fa';
import { useToast } from '../../../shared/hooks/useToast';
import Dropdown from '../../../shared/components/ui/Dropdown';
import { FiShare2 } from 'react-icons/fi';
import { Button } from '../../../shared/components/ui/Button';
import Toast from '../../../shared/components/ui/Toast';
import { useToastContext } from '../../../shared/providers/ToastProvider';

interface ShareActionsProps {
  postId: number;
}

export const ShareActions: React.FC<ShareActionsProps> = ({ postId }) => {
  const { showToast } = useToastContext();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(url);
    console.log('od');
    
    showToast('Link copied to clipboard!', 'success');
  };

  return (
    <Dropdown
      trigger={
       <Button variant="secondary" size="sm" className="space-x-2" >
          <FiShare2 />
          <span>Share</span>
        </Button>
      }
    >
      <button
        onClick={handleCopyLink}
        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
      >
        Copy Link
      </button>
      {/* You can add more items here like "Share to X", "Embed", etc. */}
  
  </Dropdown>

  );
};