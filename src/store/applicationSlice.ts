// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import applicationData from '@/data/applicationData.json';

// // Add a type for our state to make it safer
// interface ApplicationState {
//   workbenchSection: string;
//   activeSource: string;
//   medical: any;
//   application: any;
//   // other properties from applicationData.json
// }

// // Create an initial state by extending applicationData
// const initialState: ApplicationState = {
//   ...applicationData,
//   workbenchSection: 'EHRs', // Default section
//   activeSource: ''
// };

// const applicationSlice = createSlice({
//   name: 'application',
//   initialState,
//   reducers: {
//     setWorkbenchSection: (state, action: PayloadAction<string>) => {
//       state.workbenchSection = action.payload;
//     },
//     setActiveSource: (state, action: PayloadAction<string>) => {
//       state.activeSource = action.payload;
//     },
//     // Add other reducers as needed
//   },
// });

// // Export the actions
// export const { setWorkbenchSection, setActiveSource } = applicationSlice.actions;

// // Export the reducer
// export default applicationSlice.reducer;