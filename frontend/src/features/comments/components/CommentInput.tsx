import React, { useState } from 'react';
import { useCreateCommentMutation } from '../services/commentsApi';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import { Button } from '../../../shared/components/ui/Button';
import { Textarea } from '../../../shared/components/ui/TextArea';

interface CommentInputProps {
  postId: number;
  parentId?: number;
  onCommentPosted?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  initialContent?: string;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  parentId,
  onCommentPosted,
  onCancel,
  autoFocus = false,
  initialContent = '',
}) => {
  const [content, setContent] = useState(initialContent);
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const { showToast } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Comment cannot be empty', 'error');
      return;
    }

    try {
      await createComment({ postId, data: { content, parentId } }).unwrap();
      setContent('');
      showToast('Comment posted successfully', 'success');
      onCommentPosted?.();
    } catch (error: any) {
      const errorMessage = error.data?.message || error.message || 'Failed to post comment';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        rows={parentId ? 2 : 4} // Smaller for replies
        placeholder={parentId ? 'Write a reply...' : 'Write a comment...'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus={autoFocus}
      />
      <div className="flex justify-end space-x-2 mt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" >
          {parentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
};