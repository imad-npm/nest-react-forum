import { createSlice } from '@reduxjs/toolkit';
import type { UserResponseDto } from '../types';
import { authApi } from '../services/authApi';

interface AuthState {
  user: UserResponseDto | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This is a synchronous logout action for immediate UI updates if needed.
    // The main logout logic is handled by the API mutation.
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.user = action.payload.data.user;
          state.accessToken = action.payload.data.accessToken;
        }
      )
      .addMatcher(
        authApi.endpoints.getProfile.matchFulfilled,
        (state, action) => {
          state.user = action.payload.data.user;
          state.accessToken = action.payload.data.accessToken;
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
