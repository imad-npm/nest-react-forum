import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Post, CreatePostDto, UpdatePostDto, PostQueryDto, PaginatedResponse, ResponseDto } from '../types';

export const postsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth?.accessToken;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Posts'],
    endpoints: (builder) => ({
        getPosts: builder.query<PaginatedResponse<Post>, PostQueryDto>({
            query: (params) => ({ url: '/posts', params }),
            serializeQueryArgs: ({ endpointName }) => endpointName, // shared cache
            merge: (currentCache, newItems) => {
                currentCache.data.push(...newItems.data);
                currentCache.meta = newItems.meta;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
            keepUnusedDataFor: 60, // keeps old data while fetching next page
            providesTags: ['Posts']
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
