import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputError } from '../../../shared/components/ui/InputError';
import { Button } from '../../../shared/components/ui/Button';
import { useToastContext } from '../../../shared/providers/ToastProvider';
import { useCreateCommentMutation } from '../services/commentsApi';
import { useAppSelector } from '../../../shared/stores/hooks'; // Assuming you have this for user info

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty.'),
});

interface CommentInputProps {
  postId: number;
  parentId?: number;
  onCommentPosted?: () => void;
  onCancelReply?: () => void;
  replyingTo?: string; // Optional: name of the user being replied to
}

const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  parentId,
  onCommentPosted,
  onCancelReply,
  replyingTo,
}) => {
  const { accessToken } = useAppSelector((state) => state.auth); // Check if user is logged in
  const { showToast } = useToastContext();
  const [createComment, { isLoading, error }] = useCreateCommentMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ content: string }>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: { content: string }) => {
    if (!accessToken) {
      showToast('You must be logged in to comment.', 'error');
      return;
    }
    try {
      await createComment({
        postId,
        data: { content: data.content, parentId },
      }).unwrap();
      showToast('Comment posted successfully!', 'success');
      reset();
      onCommentPosted?.();
      onCancelReply?.(); // Close reply form if applicable
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || 'Failed to post comment.';
      showToast(errorMessage, 'error');
      console.error('Failed to post comment: ', err);
    }
  };

  const placeholderText = replyingTo ? `Replying to u/${replyingTo}` : 'What are your thoughts?';

  return (
    <div className="mb-4">
      {replyingTo && (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-t-md">
          <p className="text-sm text-gray-700">Replying to <span className="font-semibold">u/{replyingTo}</span></p>
          <Button variant="ghost" size="sm" onClick={onCancelReply}>Cancel</Button>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <textarea
          {...register('content')}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm resize-y"
          rows={parentId ? 2 : 4} // Smaller for replies
          placeholder={placeholderText}
          disabled={isLoading || !accessToken}
        ></textarea>
        {errors.content && <InputError message={errors.content.message} />}
        {error && (
            <InputError message={(error as any).data?.message || (error as any).message || 'Unknown error'} />
        )}
        <div className="flex justify-end space-x-2">
            {onCancelReply && parentId && ( // Show cancel only for reply forms
                <Button type="button" variant="outline" onClick={onCancelReply} disabled={isLoading}>
                    Cancel
                </Button>
            )}
            <Button type="submit" disabled={isLoading || !accessToken} className="min-w-[120px]">
                {isLoading ? 'Posting...' : 'Post Comment'}
            </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentInput;
