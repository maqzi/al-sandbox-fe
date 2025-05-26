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
  DialogActions
} from '@mui/material';
import { 
  ArrowBack, 
  Save as SaveIcon
} from '@mui/icons-material';
import { RootState } from '@/store/store';
import { setActiveRule, setActiveVersion } from '@/store/rulesSlice';
import Whiteboard from '@/components/RulesDesigner/Whiteboard/Whiteboard';

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
          showTopNav={true} // Don't show duplicate header in Whiteboard component
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
    </Box>
  );
};

export default WhiteboardPage;