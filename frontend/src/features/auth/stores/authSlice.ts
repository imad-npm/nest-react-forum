import { createSlice } from '@reduxjs/toolkit';
import type { UserResponseDto } from '../types';
import { authApi } from '../services/authApi';

interface AuthState {
  user: UserResponseDto | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
      }
    );
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
