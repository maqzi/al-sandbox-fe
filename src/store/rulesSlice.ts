import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import rulesData from '@/data/rulesTree.json';

// Define TypeScript interfaces for better type safety
export interface RuleVersion {
  version: string;
  nodes: any[];
  edges: any[];
  tag: string;
  note: string;
}

export interface Rule {
  id: string;
  name: string;
  versions: RuleVersion[];
  activeVersionId: string; // Track active version for each rule
}

interface RulesState {
  rules: Rule[];
  activeRule: Rule | null;
  activeVersion: RuleVersion | null;
}

// Process rules data from JSON file to ensure activeVersionId is set
const processRulesData = (): Rule[] => {
  return rulesData.rules.map(rule => {
    // Find the latest version for this rule
    let latestVersion = '';
    if (rule.versions && rule.versions.length > 0) {
      // First try to find a version tagged as 'latest'
      const latest = rule.versions.find(v => v.tag === 'latest');
      if (latest) {
        latestVersion = latest.version;
      } else {
        // Otherwise use the first version (assuming versions are in descending order)
        latestVersion = rule.versions[0].version;
      }
    }
    
    // Return rule with activeVersionId set
    return {
      ...rule,
      activeVersionId: rule.activeVersionId || latestVersion // Use existing activeVersionId if present
    };
  });
};

// Initial state loaded from JSON file
const initialState: RulesState = {
  rules: processRulesData(),
  activeRule: null,
  activeVersion: null
};

export const addRule = createAction<Rule>('rules/addRule');

const rulesSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    setActiveRule(state, action: PayloadAction<Rule | null>) {
      state.activeRule = action.payload;
    },
    setActiveVersion(state, action: PayloadAction<RuleVersion | null>) {
      state.activeVersion = action.payload;
    },
    updateRuleActiveVersion(state, action: PayloadAction<{ruleId: string, versionId: string}>) {
      const { ruleId, versionId } = action.payload;
      const rule = state.rules.find(rule => rule.id === ruleId);
      
      if (rule) {
        // Update the active version for this rule
        rule.activeVersionId = versionId;
        
        // If this is the active rule, also update the active version
        if (state.activeRule && state.activeRule.id === ruleId) {
          const newActiveVersion = rule.versions.find(v => v.version === versionId) || null;
          state.activeVersion = newActiveVersion;
        }
      }
    },
    updateRule: (state, action: PayloadAction<Rule>) => {
      const updatedRule = action.payload;
      const index = state.rules.findIndex(rule => rule.id === updatedRule.id);
      if (index !== -1) {
        state.rules[index] = updatedRule;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addRule, (state, action) => {
      state.rules.push(action.payload);
    });
  }
});

export const { setActiveRule, setActiveVersion, updateRuleActiveVersion, updateRule } = rulesSlice.actions;

// Export the reducer as default (this was missing before)
export default rulesSlice.reducer;

// Also export named for compatibility with existing code
export const rulesReducer = rulesSlice.reducer;
