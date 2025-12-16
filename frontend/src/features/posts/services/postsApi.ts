import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Post, CreatePostDto, UpdatePostDto, PostQueryDto, PaginatedResponse, ResponseDto } from '../types';

export const postsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
    tagTypes: ['Posts'],
    endpoints: (builder) => ({
        getPosts: builder.query<PaginatedResponse<Post>, PostQueryDto>({
            query: (params) => ({
                url: '/posts',
                params: params,
            }),
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
            invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
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
    useGetPostsQuery,
    useGetPostByIdQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postsApi;
