import React from 'react';

import SearchableSelect from '../../../shared/components/ui/SearchableSelect';
import { Textarea } from '../../../shared/components/ui/TextArea';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { InputError } from '../../../shared/components/ui/InputError';
import { Button } from '../../../shared/components/ui/Button';
import { useCreatePost } from '../hooks/useCreatePost';
import { Controller } from 'react-hook-form';
import { SimpleEditor } from '../../../shared/components/simpleEditor/SimpleEditor';

const CreatePostForm: React.FC = () => {
  const { form, communitySearch, create } = useCreatePost();
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
  <Controller
    name="content"
    defaultValue=''
    control={form.control}
    render={({ field }) => (
      <SimpleEditor value={field.value || ''} onChange={field.onChange} />
    )}
  />
  <InputError message={errors.content?.message} />
</div>

      {/* Community */}
      <div>
        <Label className="block text-sm font-medium">Community</Label>

     <Controller
  name="communityId"
  defaultValue={0}
  control={form.control}
  render={({ field, fieldState }) => (
    <>
      <SearchableSelect
        value={communities.find(c => c.id === field.value)?.name || ''}
        onSearch={setSearch}
        options={communities}
        loading={isFetching}
        getLabel={(c) => c.name}
        renderOption={(c) => <span>{c.name}</span>}
        onSelect={(c) => field.onChange(c.id)}
        placeholder="Search community..."
      />
      <InputError message={fieldState.error?.message} />
    </>
  )}
/>

      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating…' : 'Create Post'}
      </Button>
    </form>
  );
};

export default CreatePostForm;
