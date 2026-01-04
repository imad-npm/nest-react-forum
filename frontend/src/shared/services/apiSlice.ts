import {
  
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type RootState,
} from '@reduxjs/toolkit/query/react';
import { setAccessToken, logout } from '../../features/auth/stores/authSlice';

// Create a base query with authentication headers
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api/',
  prepareHeaders: (headers, { getState }) => {
    // Assuming your auth slice is named 'auth' and has an 'accessToken' field
    const token = (getState() as RootState).auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery({ url: 'auth/refresh' }, api, extraOptions);
 
  console.log('refreshResult:', refreshResult);
    if (refreshResult.data) {
      const { accessToken } = (refreshResult.data as any).data;
      // store the new token
      api.dispatch(setAccessToken(accessToken));
      // retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh token is invalid or expired, log the user out
      api.dispatch(logout());
    }
  }

  return result;
};

// Create a base API slice that other API slices can extend
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  // Define common tag types here if any, otherwise leave empty
  tagTypes: [
    'Posts',
    'Comments',
    'Me',
    'Profile',
    'Reactions',
    'Communities',
    'CommunityMemberships',
    'CommunityMembershipRequests',
    'CommunityRestrictions',
    'Reports',
    "Users"
  ],
  endpoints: () => ({}), // Empty endpoints as this is a base slice
});
