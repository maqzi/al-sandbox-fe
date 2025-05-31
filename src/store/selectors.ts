import { RootState } from './store';

// Workbench selectors
export const selectAllCases = (state: RootState) => state.workbench.cases;
export const selectSelectedCaseId = (state: RootState) =>
  state.workbench.selectedCaseId;

export const selectSelectedCase = (state: RootState) => {
  const selectedId = state.workbench.selectedCaseId;
  if (!selectedId) return null;

  return state.workbench.cases.find(c => c.id === selectedId) || null;
};

export const selectCurrentWorkbenchSection = (state: RootState) => {
  const selectedCase = selectSelectedCase(state);
  return selectedCase?.workbench.currentSection || 'Case Details';
};

export const selectActiveSource = (state: RootState) => {
  const selectedCase = selectSelectedCase(state);
  return selectedCase?.workbench.activeSource || '';
};
