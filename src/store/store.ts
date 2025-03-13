import { configureStore } from '@reduxjs/toolkit';
import { applicationReducer } from './applicationSlice';
import { medicalReducer } from './medicalSlice';
import { userReducer } from './userSlice';
import { rulesReducer } from './rulesSlice';

const store = configureStore({
  reducer: {
    application: applicationReducer,
    medical: medicalReducer,
    user: userReducer,
    rules: rulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;