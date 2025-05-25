import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button,
  Alert,
  Snackbar,
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  ArrowBack, 
  Save as SaveIcon
} from '@mui/icons-material';
import { RootState } from '@/store/store';
import Whiteboard from '@/components/Whiteboard';

const WhiteboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { ruleId } = useParams<{ ruleId: string }>();
  
  const rules = useSelector((state: RootState) => state.rules.rules);
  const activeRule = useSelector((state: RootState) => state.rules.activeRule);
  const activeVersion = useSelector((state: RootState) => state.rules.activeVersion);
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && autoSaveStatus === 'idle') {
      const autoSaveTimer = setTimeout(() => {
        setAutoSaveStatus('saving');
        // Simulate auto-save
        setTimeout(() => {
          setAutoSaveStatus('saved');
          setHasUnsavedChanges(false);
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        }, 1000);
      }, 5000); // Auto-save after 5 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasUnsavedChanges, autoSaveStatus]);

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
    if (hasUnsavedChanges) {
      setPendingNavigation(targetPath || '/rules-designer');
      setShowUnsavedDialog(true);
    } else {
      navigate(targetPath || '/rules-designer');
    }
  };

  const handleSaveAndExit = () => {
    setAutoSaveStatus('saving');
    // Simulate save
    setTimeout(() => {
      setHasUnsavedChanges(false);
      setShowUnsavedDialog(false);
      if (pendingNavigation) {
        navigate(pendingNavigation);
      }
    }, 1000);
  };

  const handleDiscardAndExit = () => {
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const handleQuickSave = () => {
    setAutoSaveStatus('saving');
    setTimeout(() => {
      setAutoSaveStatus('saved');
      setHasUnsavedChanges(false);
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    }, 1000);
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
          showTopNav={false} // Don't show duplicate header in Whiteboard component
        />
      </Box>

      {/* Floating Action Button for Quick Save */}
      {hasUnsavedChanges && (
        <Fab
          color="primary"
          onClick={handleQuickSave}
          disabled={autoSaveStatus === 'saving'}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
        >
          <Tooltip title="Quick Save">
            <SaveIcon />
          </Tooltip>
        </Fab>
      )}

      {/* Auto-save notification */}
      <Snackbar
        open={autoSaveStatus === 'saved'}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity="success" variant="filled">
          Changes saved automatically
        </Alert>
      </Snackbar>

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
          <Alert severity="info" sx={{ mt: 2 }}>
            Your changes will be automatically saved every 5 seconds, but you can save manually to ensure they're preserved.
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
            disabled={autoSaveStatus === 'saving'}
          >
            {autoSaveStatus === 'saving' ? 'Saving...' : 'Save & Exit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhiteboardPage;