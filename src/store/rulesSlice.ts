import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import rulesData from '@/data/rulesTree.json';

interface RuleVersion {
  version: string;
  nodes: any[];
  edges: any[];
  tag: string;
  note: string;
}

interface Rule {
  id: string;
  name: string;
  versions: RuleVersion[];
}

interface RulesState {
  rules: Rule[];
  activeRule: Rule | null;
  activeVersion: RuleVersion | null;
}

const initialState: RulesState = {
  rules: rulesData.rules,
  activeRule: null,
  activeVersion: null
};

const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    setRules: (state, action: PayloadAction<Rule[]>) => {
      state.rules = action.payload;
    },
    setActiveRule: (state, action: PayloadAction<Rule | null>) => {
      state.activeRule = action.payload;
    },
    setActiveVersion: (state, action: PayloadAction<RuleVersion | null>) => {
      state.activeVersion = action.payload;
    }
  },
});

export const { setRules, setActiveRule, setActiveVersion } = rulesSlice.actions;
export const rulesReducer = rulesSlice.reducer;