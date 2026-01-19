import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import SearchableSelect from '../../../shared/components/ui/SearchableSelect';
import { Textarea } from '../../../shared/components/ui/TextArea';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { InputError } from '../../../shared/components/ui/InputError';
import { Button } from '../../../shared/components/ui/Button';
import { SimpleEditor } from '../../../shared/components/simpleEditor/SimpleEditor';
import { useEditPost } from '../hooks/useEditPost';
import { PostStatus, type Post } from '../types';

interface EditPostFormProps {
  post: Post;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ post }) => {
  const { form, communitySearch, edit } = useEditPost(post);
  const { register, handleSubmit, setValue, formState: { errors } } = form;
  const { search, setSearch, communities, isFetching } = communitySearch;
  const { handleEditPost, isLoading } = edit;

  // Pre-fill form when post data loads

  // Determine if form should be editable (approved posts may be locked)
  const isLocked = post?.status === PostStatus.APPROVED;

  return (
    <form onSubmit={handleSubmit(handleEditPost)} className="space-y-4">
      {/* Title */}
      <div>
        <Label className="block text-sm font-medium">Title</Label>
        <Input {...register('title')} disabled={isLocked} />
        <InputError message={errors.title?.message} />
      </div>

      {/* Content */}
      <div>
        <Label className="block text-sm font-medium">Content</Label>
        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <SimpleEditor
              value={field.value || ''}
              onChange={field.onChange}
              readOnly={isLocked}
            />
          )}
        />
        <InputError message={errors.content?.message} />
      </div>

      {/* Community */}
      <div>
        <Label className="block text-sm font-medium">Community</Label>
        <Controller
          name="communityId"
          control={form.control}
          render={({ field, fieldState }) => (
            <>
              <SearchableSelect
                value={communities.find(c => c.id === field.value)?.name || post.community?.name || ''}
                onSearch={setSearch}
                options={communities}
                loading={isFetching}
                getLabel={(c) => c.name}
                renderOption={(c) => <span>{c.name}</span>}
                onSelect={(c) => field.onChange(c.id)}
                placeholder="Search community..."
                disabled={isLocked}
              />
              <InputError message={fieldState.error?.message} />
            </>
          )}
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading || isLocked}>
        {isLocked ? 'Post Locked' : isLoading ? 'Updating…' : 'Update Post'}
      </Button>
    </form>
  );
};

export default EditPostForm;
