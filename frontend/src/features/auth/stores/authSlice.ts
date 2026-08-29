import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserResponseDto } from '../../user/types';

interface AuthState {
  accessToken: string | null;
    user: UserResponseDto | null;

}

const initialState: AuthState = {
  accessToken: null,
    user:  null

};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, logout } = authSlice.actions;

export default authSlice.reducer;
