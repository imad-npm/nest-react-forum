import { apiSlice } from '../../../shared/services/apiSlice';
import type { PaginatedResponse, ResponseDto } from '../../../shared/types';
import type { CreateSavedPostDto, SavedPost, SavedPostQueryDto } from '../types';

export const savedPostsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
      getSavedPosts: builder.infiniteQuery<
  PaginatedResponse<SavedPost>,
  SavedPostQueryDto,
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
    url: '/saved-posts',
    params: {
      ...(queryArg ?? {}),
      page: pageParam,
      limit: queryArg?.limit ?? 10,
    },
  }),

  keepUnusedDataFor: 60,
  providesTags: ['SavedPosts'],
}),
      
        createSavedPost: builder.mutation<ResponseDto<SavedPost>, CreateSavedPostDto>({
            query: (newPost) => ({
                url: '/saved-posts',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: ['Posts',"SavedPosts"],
        }),
        deleteSavedPost: builder.mutation<ResponseDto<boolean>, number>({
            query: (id) => ({
                url: `/saved-posts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Posts',"SavedPosts"],
        }),
    }),
});

export const {
    
      useGetSavedPostsInfiniteQuery,
      useCreateSavedPostMutation ,
      useDeleteSavedPostMutation

} = savedPostsApi;
