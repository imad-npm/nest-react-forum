import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Create a base query with authentication headers
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api/',
  prepareHeaders: (headers, { getState }) => {
    // Assuming your auth slice is named 'auth' and has an 'accessToken' field
    const token = (getState() as any).auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// Create a base API slice that other API slices can extend
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  // Define common tag types here if any, otherwise leave empty
  tagTypes: ['Posts', 'Comments', 'Users', 'Reactions',
     'Auth', 'Communities', 'CommunityMemberships',
      'EmailVerification', 'Profile', 'ResetPassword',
       'PostReaction', 'CommentReaction', 'PostStats',
        'CommentStats',"CommunityMembershipRequests"],
  endpoints: () => ({}), // Empty endpoints as this is a base slice
});
