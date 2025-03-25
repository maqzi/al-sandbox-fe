import { configureStore } from '@reduxjs/toolkit';
import rulesReducer from './rulesSlice';
import { userReducer } from './userSlice';
import workbenchReducer from './workbenchSlice';



export const store = configureStore({
  reducer: {
    rules: rulesReducer,
    user: userReducer,
    workbench: workbenchReducer,
  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;