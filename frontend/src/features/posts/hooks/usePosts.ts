import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import { useGetCommunitiesQuery } from '../../communities/services/communitiesApi';
import { useCreatePostMutation } from '../services/postsApi';

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
/*                                    Hook                                    */
/* -------------------------------------------------------------------------- */

export const usePosts = () => {
  const navigate = useNavigate();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const {
    register,
    handleSubmit,
    setValue,
      control, // ✅ ADD THIS
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

  const handleCreatePost = async (values: CreatePostFormValues) => {
    try {
      await createPost(values).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Create post failed', err);
    }
  };

  /* -------------------------------------------------------------------------- */

  return {
    form: {
      register,
      handleSubmit,
      setValue,
        control, // ✅ ADD THIS
      errors,
    },
    communitySearch: {
      search,
      setSearch,
      communities,
      isFetching,
    },
    create: {
      handleCreatePost,
      isLoading,
    },
  };
};
