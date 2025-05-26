import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Snackbar,
  Checkbox,
  Alert as MuiAlert
} from '@mui/material';
import { 
  ArrowBack, 
  Save as SaveIcon,
  Info,
  CheckCircle
} from '@mui/icons-material';
import {
  Close, Settings
} from '@mui/icons-material';
import { RootState } from '@/store/store';
import { updateRule, setActiveRule, setActiveVersion } from '@/store/rulesSlice';
import Whiteboard from '@/components/RulesDesigner/Whiteboard/Whiteboard';
import TestRuleDialog from '../components/RulesDesigner/Whiteboard/TestRuleDialog';

const WhiteboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { ruleId, versionId } = useParams<{ ruleId: string; versionId?: string }>();
  const dispatch = useDispatch();
  
  const rules = useSelector((state: RootState) => state.rules.rules);
  const activeRule = useSelector((state: RootState) => state.rules.activeRule);
  const activeVersion = useSelector((state: RootState) => state.rules.activeVersion);
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [editedVersionNote, setEditedVersionNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [saveVersionDialogOpen, setSaveVersionDialogOpen] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [versionNote, setVersionNote] = useState('');
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testResults, setTestResults] = useState<null | {
    overall: {
      stp: number;
      accuracy: number;
      resourceUtilization: number;
      averageProcessingTime: number;
    },
    cases: Array<{
      id: string;
      name: string;
      result: string;
      outcome: 'approved' | 'rejected' | 'referred';
      processingTime: number;
      risk: 'low' | 'medium' | 'high';
    }>
  }>(null);
  // Effect to handle rule and version loading from URL parameters
  useEffect(() => {
    if (ruleId && !activeRule) {
      // Find the rule by ID
      const rule = rules.find(r => r.id === ruleId);
      if (rule) {
        // If versionId is provided, find that specific version
        let version;
        if (versionId) {
          version = rule.versions.find(v => v.version === versionId);
        } else {
          // Fall back to active version or latest
          version = rule.versions.find(v => v.version === rule.activeVersionId) || 
                   rule.versions.find(v => v.tag === 'latest') || 
                   rule.versions[0];
        }
        
        if (version) {
          // Set the active rule and version in Redux
          dispatch(setActiveRule(rule));
          dispatch(setActiveVersion(version));
        }
      }
    }
  }, [ruleId, versionId, rules, activeRule, dispatch]);

  // Handle browser back button and navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleBackNavigation = (targetPath?: string) => {
    const defaultPath = versionId 
      ? `/rules-designer` 
      : '/rules-designer';

    if (hasUnsavedChanges) {
      setPendingNavigation(targetPath || defaultPath);
      setShowUnsavedDialog(true);
    } else {
      navigate(targetPath || defaultPath);
    }
  };

  const handleSaveAndExit = () => {
    // Simulate save
    setTimeout(() => {
      setHasUnsavedChanges(false);
      setShowUnsavedDialog(false);
      showSuccessMessage('Rule saved successfully!');
      
      // Navigate after a brief delay to show the success message
      setTimeout(() => {
        if (pendingNavigation) {
          navigate(pendingNavigation);
        }
      }, 1500);
    }, 1000);
  };

  const handleDiscardAndExit = () => {
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  // Function to handle opening the settings dialog
  const handleSettingsDialogOpen = () => {
    // Initialize the note field with the current version note
    setEditedVersionNote(activeVersion?.note || '');
    setSettingsDialogOpen(true);
  };

  // Function to handle closing the settings dialog
  const handleSettingsDialogClose = () => {
    setSettingsDialogOpen(false);
    setEditedVersionNote(''); // Clear form data
    console.log('Settings dialog closed');
  };

  // Function to save updated version note
  const handleUpdateVersionNote = () => {
    if (!activeRule || !activeVersion) return;

    // Create updated version object
    const updatedVersionObj = {
      ...activeVersion,
      note: editedVersionNote
    };

    // Update the version in the rule's versions array
    const updatedVersions = activeRule.versions.map(v => 
      v.version === activeVersion.version ? updatedVersionObj : v
    );

    // Create the updated rule
    const updatedRule = {
      ...activeRule,
      versions: updatedVersions
    };

    // Dispatch action to update the rule in Redux
    dispatch(updateRule(updatedRule));
    
    // Also update the active version in the Redux store
    dispatch(setActiveVersion(updatedVersionObj));

    // Show success message
    setSuccessMessage('Rule settings updated successfully!');
    setSaveSuccess(true);
    
    // Close dialog
    setSettingsDialogOpen(false);
  };

  // Function to pass success messages
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setSaveSuccess(true);
  };

  // Function to handle closing success snackbar
  const handleCloseSuccessSnackbar = () => {
    setSaveSuccess(false);
    setSuccessMessage('');
  };

  // Function to handle save button click
  const handleSaveClick = () => {
    // If no changes, show notification and return
    if (!hasUnsavedChanges) {
      return;
    }
    
    // Calculate the next version number based on the current version
    const currentVersion = activeVersion?.version || '1.0';
    const parts = currentVersion.split('.');
    const majorVersion = parseInt(parts[0] || '1');
    const minorVersion = parseInt(parts[1] || '0');
    const suggestedVersion = `${majorVersion}.${minorVersion + 1}`;
    
    setNewVersion(suggestedVersion);
    setVersionNote(`Updated rule flow for ${activeRule?.name}`);
    setSaveVersionDialogOpen(true);
  };

  // Save version handler
  const handleSaveVersion = () => {
    if (!activeRule || !activeVersion) return;

    // Get current nodes and edges from the Whiteboard component
    // We'll need to pass these as props or get them from Redux
    const currentNodes = activeVersion.nodes || [];
    const currentEdges = activeVersion.edges || [];

    // Create new version object with current nodes and edges
    const newVersionObj = {
      version: newVersion,
      tag: 'latest',
      note: versionNote,
      nodes: currentNodes,
      edges: currentEdges
    };

    // Update existing versions to remove 'latest' tag from others
    const updatedVersions = activeRule.versions.map(v => ({
      ...v,
      tag: v.tag === 'latest' ? undefined : v.tag
    }));

    // Create the updated rule with new version
    const updatedRule = {
      ...activeRule,
      versions: [...updatedVersions, newVersionObj],
      activeVersionId: newVersion
    };

    // Dispatch action to update the rule in Redux
    dispatch(updateRule(updatedRule));
    
    // Also update the active rule and version in the Redux store
    dispatch(setActiveRule(updatedRule));
    dispatch(setActiveVersion(newVersionObj));

    // Close dialog and show success
    setSaveVersionDialogOpen(false);
    setHasUnsavedChanges(false);
    
    // Show success message
    showSuccessMessage('Rule version saved successfully!');
  };

  // Save dialog close handler
  const handleSaveDialogClose = () => {
    setSaveVersionDialogOpen(false);
    console.log('Save dialog closed');
  };

  // Test dialog close handler
  const handleTestDialogClose = () => {
    setTestDialogOpen(false);
  };

  // The test handler
  const handleTestRuleClick = () => {
    setTestDialogOpen(true);
  };

  // Callback to receive test results
  const handleTestComplete = (results: any) => {
    setTestResults(results);
  };

  if (!activeRule || !activeVersion) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Rule not found
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          The requested rule could not be found or is not available.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/rules-designer')}
          startIcon={<ArrowBack />}
        >
          Back to Rules Designer
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f8f9fc'
    }}>
      {/* Whiteboard Content - Full height with rule info in sidebar */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Whiteboard 
          onClose={() => handleBackNavigation()}
          onNeedHelp={() => {
            // Handle help functionality
            console.log('Help requested');
          }}
          onUnsavedChanges={setHasUnsavedChanges}
          showTopNav={true}
          onSettingsClick={handleSettingsDialogOpen}
          onSaveClick={handleSaveClick}
          onTestRuleClick={handleTestRuleClick}
          testResults={testResults}
        />
      </Box>

      {/* Unsaved Changes Dialog */}
      <Dialog
        open={showUnsavedDialog}
        onClose={() => setShowUnsavedDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SaveIcon sx={{ mr: 1, color: 'warning.main' }} />
            Unsaved Changes
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You have unsaved changes to this rule. What would you like to do?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Make sure to save your changes before leaving to avoid losing your work.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDiscardAndExit}
            color="inherit"
          >
            Discard Changes
          </Button>
          <Button 
            onClick={() => setShowUnsavedDialog(false)}
            variant="outlined"
          >
            Continue Editing
          </Button>
          <Button 
            onClick={handleSaveAndExit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ textTransform: 'none' }}

          >
            Save & Exit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={settingsDialogOpen}
        onClose={handleSettingsDialogClose}
        PaperProps={{ 
          style: { 
            borderRadius: '12px',
            maxWidth: '450px'
          } 
        }}
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#f5f7fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px'
        }}>
          <Box display="flex" alignItems="center">
            <Settings sx={{ color: '#5569ff', marginRight: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Rule Settings
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleSettingsDialogClose}
            aria-label="close"
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '24px' }}>
          <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update the settings for this rule version.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            id="note"
            label="Version Notes"
            placeholder="Describe what changes you made in this version"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={editedVersionNote}
            onChange={(e) => setEditedVersionNote(e.target.value)}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            onClick={handleSettingsDialogClose} 
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateVersionNote} 
            variant="contained"
            color="primary"
            disabled={!editedVersionNote.trim()}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
            }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleCloseSuccessSnackbar}
          severity="success"
          variant="filled"
          icon={<CheckCircle />}
          sx={{
            borderRadius: '8px',
            fontWeight: 500,
            '& .MuiAlert-message': {
              fontSize: '0.95rem'
            }
          }}
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>

      {/* Save Version Dialog */}
      <Dialog
        open={saveVersionDialogOpen}
        onClose={handleSaveDialogClose}
        PaperProps={{ 
          style: { 
            borderRadius: '12px',
            maxWidth: '500px'
          } 
        }}
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#f5f7fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px'
        }}>
          <Box display="flex" alignItems="center">
            <SaveIcon sx={{ color: '#5569ff', marginRight: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Save New Version
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleSaveDialogClose}
            aria-label="close"
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '24px' }}>
          <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new version of this rule with your current changes.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            id="version"
            label="Version Number"
            type="text"
            fullWidth
            variant="outlined"
            value={newVersion}
            onChange={(e) => setNewVersion(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            id="note"
            label="Version Notes"
            placeholder="Describe what changes you made in this version"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={versionNote}
            onChange={(e) => setVersionNote(e.target.value)}
          />
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mt: 3,
            p: 2, 
            bgcolor: 'rgba(85, 105, 255, 0.05)',
            borderRadius: 1,
            border: '1px solid rgba(85, 105, 255, 0.1)'
          }}>
            <Checkbox 
              checked={true} 
              disabled 
              sx={{ '& .MuiSvgIcon-root': { fontSize: 22 } }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Mark as latest version
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This version will be used when the rule is executed
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'rgba(255, 193, 7, 0.1)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 193, 7, 0.2)',
            mt: 3
          }}>
            <Info fontSize="small" sx={{ color: '#ffc107', marginRight: 1 }} />
            <Typography component="div" variant="caption" color="text.secondary">
              <strong>Note:</strong> Saved versions are temporary for this demo and will be lost if you refresh the page.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            onClick={handleSaveDialogClose} 
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveVersion} 
            variant="contained"
            color="primary"
            disabled={!newVersion.trim()}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
            }}
          >
            Save Version
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test Rule Dialog */}
      <TestRuleDialog
        open={testDialogOpen}
        onClose={handleTestDialogClose}
        onTestComplete={handleTestComplete}
      />
    </Box>
  );
};

export default WhiteboardPage;