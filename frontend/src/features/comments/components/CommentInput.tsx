import React from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Textarea } from '../../../shared/components/ui/TextArea';
import { useComments } from '../hooks/useComments';

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
  const { content, setContent, handleCreateComment, isCreating } = useComments({
    postId,
    parentId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateComment(onCommentPosted, content || initialContent);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        rows={parentId ? 2 : 4} // Smaller for replies
        placeholder={parentId ? 'Write a reply...' : 'Write a comment...'}
        value={content || initialContent}
        onChange={(e) => setContent(e.target.value)}
        autoFocus={autoFocus}
      />
      <div className="flex justify-end space-x-2 mt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Replying...' : parentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
};