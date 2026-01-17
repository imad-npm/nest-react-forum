import { apiSlice } from '../../../shared/services/apiSlice';
import type { Post, CreatePostDto, UpdatePostDto, PostQueryDto, PostStatus } from '../types';
import type { PaginatedResponse, ResponseDto } from '../../../shared/types';

export const postsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
      getPosts: builder.infiniteQuery<
  PaginatedResponse<Post>,
  PostQueryDto,
  number
>({
  infiniteQueryOptions: {
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  },

  query: ({ queryArg, pageParam }) => ({
    url: '/posts',
    params: {
      ...(queryArg ?? {}),
      page: pageParam,
      limit: queryArg?.limit ?? 10,
    },
  }),

  keepUnusedDataFor: 60,
  providesTags: ['Posts'],
}),
        getPostById: builder.query<ResponseDto<Post>, number>({
            query: (id) => `/posts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Posts', id }],
        }),
        createPost: builder.mutation<ResponseDto<Post>, CreatePostDto>({
            query: (newPost) => ({
                url: '/posts',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: ['Posts'],
        }),
        updatePost: builder.mutation<ResponseDto<Post>, { id: number; data: UpdatePostDto }>({
            query: ({ id, data }) => ({
                url: `/posts/${id}`,
                method: 'PATCH',
                body: data,
            }),
          invalidatesTags: ['Posts'],
        }),
        updatePostStatus: builder.mutation<ResponseDto<Post>, { id: number; status: PostStatus }>({
          query: ({ id, status }) => ({
            url: `/posts/${id}/status`,
            method: 'PATCH',
            body: { status },
          }),
          invalidatesTags: ['Posts'],
      }),
      updateCommentLockedStatus: builder.mutation<ResponseDto<Post>, { id: number; commentsLocked: boolean }>({
          query: ({ id, commentsLocked }) => ({
            url: `/posts/${id}/comments-locked`,
            method: 'PATCH',
            body: { commentsLocked },
          }),
          invalidatesTags: ['Posts'],
      }),
        deletePost: builder.mutation<ResponseDto<boolean>, number>({
            query: (id) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Posts'],
        }),
    }),
});

export const {
    
      useGetPostsInfiniteQuery,
    useGetPostByIdQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useUpdatePostStatusMutation,
    useUpdateCommentLockedStatusMutation ,
    useDeletePostMutation,
} = postsApi;
