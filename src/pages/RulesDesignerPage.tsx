import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  DialogContentText, Table, TableHead, TableBody, TableCell, 
  TableRow, Typography, Chip, Paper, Box, Divider
} from '@mui/material';
import { Lock, Edit, PlayArrow, CheckCircle, History, Close } from '@mui/icons-material';
import { RootState } from '@/store/store';
import Whiteboard from '@/components/Whiteboard';
import { setActiveRule, setActiveVersion } from '@/store/rulesSlice';

// Define TypeScript interfaces for better type safety
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

interface RulesDesignerPageProps {
  handleStepChange: (step: number) => void;
}

const RulesDesignerPage: React.FC<RulesDesignerPageProps> = ({ handleStepChange }) => {
  // Use typed selector to avoid type errors
  const dispatch = useDispatch();
  const rules = useSelector((state: RootState) => state.rules.rules as Rule[]);
  const activeRule = useSelector((state: RootState) => state.rules.activeRule as Rule | null);
  const activeVersion = useSelector((state: RootState) => state.rules.activeVersion as RuleVersion | null);
  
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<RuleVersion | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [createRuleDialogOpen, setCreateRuleDialogOpen] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const navigate = useNavigate();

  // Set the selected rule and version at component mount
  useEffect(() => {
    // Find the Diabetes Type 2 rule
    const diabetesRule = rules.find(rule => rule.name === 'Diabetes Type 2');
    if (diabetesRule && diabetesRule.versions.length > 0) {
      // Set the selected rule to the Diabetes Type 2 rule
      setSelectedRule(diabetesRule);
      
      // Find the latest version of the Diabetes Type 2 rule
      const latestVersion = diabetesRule.versions.find(v => v.tag === 'latest') || diabetesRule.versions[0];
      setSelectedVersion(latestVersion);
    }
  }, [rules]); // Depend on rules so this runs once rules are loaded

  // Find latest version when rule changes
  useEffect(() => {
    if (selectedRule?.versions?.length) {
      const latestVersion = selectedRule.versions.find(v => v.tag === 'latest') || selectedRule.versions[0];
      setSelectedVersion(latestVersion);
    } else {
      setSelectedVersion(null);
    }
  }, [selectedRule]);

  // Memoize handlers with useCallback to prevent unnecessary re-renders
  const handleRuleClick = useCallback((rule: Rule) => {
    setSelectedRule(rule);
  }, []);

  const handleHistoryClick = useCallback((rule: Rule, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedRule(rule);
    setHistoryDialogOpen(true);
  }, []);

  const handleVersionSelect = useCallback((version: RuleVersion) => {
    setSelectedVersion(version);
    setHistoryDialogOpen(false);
  }, []);

  // Updated handlePlayClick to use Redux
  const handlePlayClick = useCallback((rule: Rule) => {
    const latestVersion = rule.versions.find(v => v.tag === 'latest') || rule.versions[0];
    // Update the Redux store with the selected rule and version
    dispatch(setActiveRule(rule));
    dispatch(setActiveVersion(latestVersion || null));
    setShowWhiteboard(true);
  }, [dispatch]);

  const handleCloseWhiteboard = useCallback(() => {
    setShowWhiteboard(false);
    // Optionally clear the active rule/version when closing the whiteboard
    dispatch(setActiveRule(null));
    dispatch(setActiveVersion(null));
  }, [dispatch]);

  // Computed values
  const lockedRuleNames = rules
    .filter(rule => !rule.versions || rule.versions.length === 0)
    .map(rule => rule.name);
    
  // Table styles extracted for better readability
  const tableStyles = {
    table: { width: '100%', borderCollapse: 'collapse' as const },
    cell: { border: '1px solid #ddd', padding: '8px' },
    lockedRow: { cursor: 'pointer', color: '#888' },
    row: { cursor: 'pointer' },
    icon: { marginLeft: '8px', cursor: 'pointer' }
  };

  // If whiteboard is shown, render the Whiteboard component
  if (showWhiteboard && activeRule && activeVersion) {
    return (
      <Whiteboard onClose={handleCloseWhiteboard} />
    );
  }

  // Otherwise, render the rules table
  return (
    <div className="p-4">
      <div className="flex justify-end items-center mb-4">
        <Button 
          onClick={() => setCreateRuleDialogOpen(true)} 
          variant="contained" 
          color="primary"
          startIcon={<Lock />}
        >
          Create Rule
        </Button>
      </div>
      
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={tableStyles.cell}>Rule ID</th>
            <th style={tableStyles.cell}>Rule Name</th>
            <th style={tableStyles.cell}>Selected Version</th>
            <th style={tableStyles.cell}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => {
            const isLocked = lockedRuleNames.includes(rule.name);
            const isSelected = selectedRule?.id === rule.id;
            
            return (
              <tr 
                key={rule.id} 
                style={isLocked ? tableStyles.lockedRow : tableStyles.row}
                onClick={() => !isLocked && handleRuleClick(rule)}
              >
                <td style={tableStyles.cell}>{rule.id}</td>
                <td style={tableStyles.cell}>
                  {isLocked && <Lock style={{ verticalAlign: 'middle' }} />} {rule.name}
                </td>
                <td style={tableStyles.cell}>
                  {isSelected && selectedVersion ? (
                    <>
                      {selectedVersion.version}
                      <Edit 
                        style={tableStyles.icon} 
                        onClick={(e) => handleHistoryClick(rule, e)} 
                      />
                    </>
                  ) : 'None'}
                </td>
                <td style={tableStyles.cell}>
                  {!isLocked ? (
                    <PlayArrow 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handlePlayClick(rule)} 
                    />
                  ) : (
                    <span>Locked</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Enhanced Version History Dialog */}
      <Dialog 
        open={historyDialogOpen} 
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: '#f5f7fa',
          borderRadius: '8px 8px 0 0',
          padding: '16px 24px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <History sx={{ marginRight: 1, color: '#5569ff' }} />
            <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
              Rule Version History: {selectedRule?.name}
            </Typography>
          </Box>
          <Button 
            onClick={() => setHistoryDialogOpen(false)}
            sx={{ minWidth: '36px', padding: '6px' }}
          >
            <Close />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ padding: '24px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Select a version to work with or view its details.
          </Typography>
          
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {selectedRule?.versions.map((version, index) => (
              <Paper
                key={version.version}
                elevation={1}
                sx={{ 
                  marginBottom: 2, 
                  padding: 2, 
                  borderRadius: '8px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  border: version.tag === 'latest' ? '1px solid #5569ff' : '1px solid #e0e0e0',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => handleVersionSelect(version)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                      <Typography variant="h6" component="span" sx={{ fontWeight: 600, marginRight: 1 }}>
                        {version.version}
                      </Typography>
                      {version.tag === 'latest' && (
                        <Chip 
                          size="small" 
                          label="Latest" 
                          color="primary" 
                          sx={{ height: '22px' }}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      {version.note}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', marginTop: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ marginRight: 2 }}>
                        Nodes: {version.nodes.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Edges: {version.edges.length}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button 
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ 
                      borderRadius: '20px',
                      textTransform: 'none',
                      minWidth: '100px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVersionSelect(version);
                    }}
                  >
                    {selectedVersion?.version === version.version ? (
                      <>
                        <CheckCircle sx={{ marginRight: 0.5, fontSize: '16px' }} />
                        Selected
                      </>
                    ) : 'Select'}
                  </Button>
                </Box>
              </Paper>
            ))}
            
            {selectedRule?.versions.length === 0 && (
              <Typography variant="body1" align="center" sx={{ padding: 3, color: 'text.secondary' }}>
                No versions available for this rule.
              </Typography>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={() => setHistoryDialogOpen(false)} 
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Rule Dialog */}
      <Dialog 
        open={createRuleDialogOpen} 
        onClose={() => setCreateRuleDialogOpen(false)}
      >
        <DialogTitle>Feature Locked!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please sign up for alitheia Labs to explore the full version.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateRuleDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RulesDesignerPage;