import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from './applicationSlice';
import rulesReducer from './rulesSlice';
import { medicalReducer } from './medicalSlice';
import { userReducer } from './userSlice';
import workbenchReducer from './workbenchSlice';

export const store = configureStore({
  reducer: {
    // application: applicationReducer,
    rules: rulesReducer,
    // medical: medicalReducer,
    user: userReducer,
    workbench: workbenchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;