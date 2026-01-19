import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import { useGetCommunitiesQuery } from '../../communities/services/communitiesApi';
import { useUpdatePostMutation } from '../services/postsApi';
import type { Post } from '../types';

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const editPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  communityId: z.number().min(1, 'Community is required'),
});

type EditPostFormValues = z.infer<typeof editPostSchema>;

/* -------------------------------------------------------------------------- */
/*                                    Hook                                    */
/* -------------------------------------------------------------------------- */

export const useEditPost = (post : Post) => {
  const navigate = useNavigate();
  const [editPost, { isLoading }] = useUpdatePostMutation();

  const {
    register,
    handleSubmit,
    setValue,
      control, // ✅ ADD THIS
    formState,
  } = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
      defaultValues: {
      title: post.title,
      content: post.content,
      communityId: post.community?.id,
    },
  });

  /* --------------------------- Search State -------------------------------- */

  const [search, setSearch] = useState('');

  const { data, isFetching } = useGetCommunitiesQuery(
    { name: search },
    { skip: search.trim().length === 0 }
  );

  const communities = data?.data ?? [];

  /* ---------------------------- Submit ------------------------------------- */

  const handleEditPost = async (values: EditPostFormValues) => {
    try {
      await editPost({id:post.id,data:values}).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Edit post failed', err);
    }
  };

  /* -------------------------------------------------------------------------- */

  return {
    form: {
      register,
      handleSubmit,
      setValue,
        control, // ✅ ADD THIS
     formState ,
    },
    communitySearch: {
      search,
      setSearch,
      communities,
      isFetching,
    },
    edit: {
      handleEditPost,
      isLoading,
    },
  };
};
