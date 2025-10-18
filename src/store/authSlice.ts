import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  token?: string | null;
  username?: string | null;
  isLocked: boolean;
  lastActiveAt?: number;
};

const initialState: AuthState = {
  token: null,
  username: null,
  isLocked: false,
  lastActiveAt: Date.now(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ token: string; username: string }>) {
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
    clearSession(state) {
      state.token = null;
      state.username = null;
    },
    setLocked(state, action: PayloadAction<boolean>) {
      state.isLocked = action.payload;
    },
    setLastActive(state) {
      state.lastActiveAt = Date.now();
    },
  },
});

export const { setSession, clearSession, setLocked, setLastActive } = authSlice.actions;
export default authSlice.reducer;
