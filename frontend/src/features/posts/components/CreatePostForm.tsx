import React from 'react';

import SearchableSelect from '../../../shared/components/ui/SearchableSelect';
import { Textarea } from '../../../shared/components/ui/TextArea';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { InputError } from '../../../shared/components/ui/InputError';
import { Button } from '../../../shared/components/ui/Button';
import { usePosts } from '../hooks/usePosts';

const CreatePostForm: React.FC = () => {
  const { form, communitySearch, create } = usePosts();
  const { register, handleSubmit, setValue, errors } = form;
  const { search, setSearch, communities, isFetching } = communitySearch;
  const { handleCreatePost, isLoading } = create;

  return (
    <form onSubmit={handleSubmit(handleCreatePost)} className="space-y-4">
      {/* Title */}
      <div>
        <Label className="block text-sm font-medium">Title</Label>
        <Input {...register('title')} />
        <InputError message={errors.title?.message} />
      </div>

      {/* Content */}
      <div>
        <Label className="block text-sm font-medium">Content</Label>
        <Textarea {...register('content')} rows={5} />
        <InputError message={errors.content?.message} />
      </div>

      {/* Community */}
      <div>
        <Label className="block text-sm font-medium">Community</Label>

        <SearchableSelect
          value={search}
          onSearch={setSearch}
          options={communities}
          loading={isFetching}
          getLabel={(c) => c.name}
          renderOption={(c) => <span>{c.name}</span>}
          onSelect={(c) => setValue('communityId', c.id)}
          placeholder="Search community..."
        />

        <InputError message={errors.communityId?.message} />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating…' : 'Create Post'}
      </Button>
    </form>
  );
};

export default CreatePostForm;
