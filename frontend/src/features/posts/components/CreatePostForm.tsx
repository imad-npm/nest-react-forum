import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import SearchableSelect from '../../../shared/components/ui/SearchableSelect';
import { useGetCommunitiesQuery } from '../../communities/services/communitiesApi';
import { useCreatePostMutation } from '../services/postsApi';
import type { Community } from '../../communities/types';
import { Textarea } from '../../../shared/components/ui/TextArea';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { InputError } from '../../../shared/components/ui/InputError';
import { Button } from '../../../shared/components/ui/Button';

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  communityId: z.number().min(1, 'Community is required'),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

/* -------------------------------------------------------------------------- */
/*                               Component                                    */
/* -------------------------------------------------------------------------- */

const CreatePostForm: React.FC = () => {
  const navigate = useNavigate();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
  });

  /* --------------------------- Search State -------------------------------- */

  const [search, setSearch] = useState('');

  const { data, isFetching } = useGetCommunitiesQuery(
    { name: search },
    { skip: search.trim().length === 0 }
  );

  const communities = data?.data ?? [];

  /* ---------------------------- Submit ------------------------------------- */

  const onSubmit = async (values: CreatePostFormValues) => {
    try {
      await createPost(values).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Create post failed', err);
    }
  };

  /* -------------------------------------------------------------------------- */

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <Label className="block text-sm font-medium">Title</Label>
        <Input
          {...register('title')}
        />
        <InputError message={errors.title?.message} />
      </div>

      {/* Content */}
      <div>
        <Label className="block text-sm font-medium">Content</Label>
        <Textarea
          {...register('content')}
          rows={5}
        />
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
          getLabel={(c) => c.displayName}
          renderOption={(c) => <span>{c.displayName}</span>}
          onSelect={(c) => setValue('communityId', c.id)}
          placeholder="Search community..."
        />

        <InputError message={errors.communityId?.message} />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Creating…' : 'Create Post'}
      </Button>
    </form>
  );
};

export default CreatePostForm;
