import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  name: string;
  email: string;
  id?: string;
  role?: string;
  plan?: string;
}

interface UserState {
  name: string;
  email: string;
  step: number;
  userInfo: UserInfo;
  sessionId?: string;
  lastActivity?: number;
}

const initialState: UserState = {
  name: '',
  email: '',
  step: 0,
  userInfo: {
    name: '',
    email: ''
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.userInfo = {
        name: action.payload.name,
        email: action.payload.email
      };
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    trackActivity: (state) => {
      state.lastActivity = Date.now();
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
  },
});

export const { setUser, setStep, trackActivity, setSessionId } = userSlice.actions;
export const userReducer = userSlice.reducer;