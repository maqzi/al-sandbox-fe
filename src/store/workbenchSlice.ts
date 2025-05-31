import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import workbenchCases from '@/data/workbenchCases.json';

// Define interfaces for our state
export interface Case {
  id: string;
  workbench: {
    currentSection: string;
    activeSource: string;
  };
  case: {
    policyNum: string;
    taskId: string;
    queue: string;
    workType: string;
    nextAction: string;
    receivedDate: string;
    dueDate: string;
    priority: string;
    assignmentStatus: string;
  };
  policy: {
    product: string;
    state: string;
    faceAmount: number;
    applicationDate: string;
    hipaaAuthDate: string;
    hasPriorPolicy: string;
    status: string;
    premium: number;
  };
  person: any; // Using 'any' for brevity, but you could define a full interface
  health: any; // Using 'any' for brevity
  assessment: any; // Using 'any' for brevity
}

interface WorkbenchState {
  cases: Case[];
  selectedCaseId: string | null;
}

// Create initial state
const initialState: WorkbenchState = {
  cases: workbenchCases.cases,
  selectedCaseId: null,
};

const workbenchSlice = createSlice({
  name: 'workbench',
  initialState,
  reducers: {
    setSelectedCase: (state, action: PayloadAction<string>) => {
      state.selectedCaseId = action.payload;
    },
    setWorkbenchSection: (
      state,
      action: PayloadAction<{ caseId: string; section: string }>
    ) => {
      const { caseId, section } = action.payload;
      const caseToUpdate = state.cases.find(c => c.id === caseId);
      if (caseToUpdate) {
        caseToUpdate.workbench.currentSection = section;
      }
    },
    setActiveSource: (
      state,
      action: PayloadAction<{ caseId: string; source: string }>
    ) => {
      const { caseId, source } = action.payload;
      const caseToUpdate = state.cases.find(c => c.id === caseId);
      if (caseToUpdate) {
        caseToUpdate.workbench.activeSource = source;
      }
    },
  },
});

// Export actions and reducer
export const { setSelectedCase, setWorkbenchSection, setActiveSource } =
  workbenchSlice.actions;
export default workbenchSlice.reducer;
