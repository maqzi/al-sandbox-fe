import { createSlice } from '@reduxjs/toolkit';
import applicationData from '@/data/applicationData.json';

const applicationSlice = createSlice({
  name: 'application',
  initialState: applicationData,
  reducers: {
    // Add reducers if needed
  },
});

export const { actions: applicationActions, reducer: applicationReducer } = applicationSlice;