import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  email: string;
  step: number;
}

const initialState: UserState = {
  name: '',
  email: '',
  step: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    logout: (state) => {
      // Clear user state
      state.name = '';
      state.email = '';
      state.step = 0;
      // Clear local storage
      localStorage.removeItem('reduxState');
    },
  },
});

export const { setUser, setStep, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;