import { configureStore } from '@reduxjs/toolkit';
import rulesReducer from './rulesSlice';
import { userReducer } from './userSlice';
import workbenchReducer from './workbenchSlice';

// Function to load state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    console.error('Failed to load state from local storage:', err);
    return undefined;
  }
};

// Function to save state to local storage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Failed to save state to local storage:', err);
  }
};

// Load persisted state
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    rules: rulesReducer,
    user: userReducer,
    workbench: workbenchReducer,
  },
  preloadedState: persistedState, // Use persisted state
});

// Subscribe to store changes to save state
store.subscribe(() => {
  saveState({
    user: store.getState().user,
    rules: store.getState().rules,
    workbench: store.getState().workbench,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;