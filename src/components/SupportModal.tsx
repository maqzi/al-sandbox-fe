import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Box, Typography, TextField, IconButton, MenuItem, Grid,
  CircularProgress
} from '@mui/material';
import { Close, HelpOutline, Check } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
  defaultSubject?: string; // Optional prop to set default subject
}

const SupportModal: React.FC<SupportModalProps> = ({ 
  open, 
  onClose, 
  defaultSubject = '' 
}) => {
  // Get user info from Redux
  const userInfo = useSelector((state: RootState) => state.user);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update form when user info changes or defaultSubject changes
  useEffect(() => {
    if (userInfo?.name) {
      setName(userInfo.name);
    }
    if (userInfo?.email) {
      setEmail(userInfo.email);
    }
    if (defaultSubject) {
      setSubject(defaultSubject);
    }
  }, [userInfo, defaultSubject]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (userInfo?.name) {
        setName(userInfo.name);
      }
      if (userInfo?.email) {
        setEmail(userInfo.email);
      }
      if (defaultSubject) {
        setSubject(defaultSubject);
      }
      setMessage('I\'m interested in ...');
    }
  }, [open, userInfo, defaultSubject]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after showing success message
      setTimeout(() => {
        setMessage('I\'m interested in ...'); // Only reset message, name/email will be from Redux
        setIsSubmitted(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  const isSubmitEnabled = Boolean(name && email && subject && message);

  return (
    <Dialog 
      open={open} 
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { borderRadius: '12px' }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: '#f5f7fa', 
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2.5
        }}
      >
        <Box display="flex" alignItems="center">
          <HelpOutline sx={{ color: 'primary.main', mr: 1.5 }} />
          <Typography variant="h6" fontWeight={600}>
            Contact Support
          </Typography>
        </Box>
        {!isSubmitting && (
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose}
            aria-label="close"
            size="small"
          >
            <Close />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {isSubmitted ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4 
            }}
          >
            <Box 
              sx={{ 
                bgcolor: 'success.light', 
                color: 'success.dark',
                p: 1.5,
                borderRadius: '50%',
                mb: 2
              }}
            >
              <Check fontSize="large" />
            </Box>
            <Typography variant="h6" gutterBottom align="center">
              Thank You!
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Your message has been sent. We'll get back to you shortly.
            </Typography>
          </Box>
        ) : isSubmitting ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 5 
            }}
          >
            <CircularProgress size={48} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Sending your message...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait a moment.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              Need help or have questions about alitheia Labs' features? Our team is ready to assist you.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={Boolean(userInfo?.name)} // Disable if we have user name from Redux
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={Boolean(userInfo?.email)} // Disable if we have user email from Redux
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  select
                  label="Subject"
                  variant="outlined"
                  fullWidth
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                >
                  <MenuItem value="data-mapping-feature">Data Mapping Feature</MenuItem>
                  <MenuItem value="rule-ai-feature">Rule AI Feature</MenuItem>
                  <MenuItem value="rule-designer-support">Rule Designer Support</MenuItem>
                  <MenuItem value="rule-test-feature">Rule Test Feature</MenuItem>
                  <MenuItem value="technical-issue">Technical Issue</MenuItem>
                  <MenuItem value="ehr-assessments-feature">EHR Assessments</MenuItem>
                  <MenuItem value="workbench-support">Workbench Support</MenuItem>
                  <MenuItem value="pricing-info">Pricing & Plans</MenuItem>
                  <MenuItem value="other-info">Other</MenuItem>
                </TextField>
              </Grid>
              
                <Grid item xs={12}>
                <TextField
                  label="Message"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Please describe your question or issue"
                />
                </Grid>
            </Grid>
            
            <Box 
              sx={{ 
                mt: 3,
                p: 2,
                bgcolor: 'rgba(85, 105, 255, 0.04)',
                border: '1px solid rgba(85, 105, 255, 0.1)',
                borderRadius: 1
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                We will reach out to you with more information. For urgent matters, please indicate that in your message.
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      
      {!isSubmitting && !isSubmitted && (
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f0f0f0' }}>
          <Button 
            onClick={onClose} 
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!isSubmitEnabled}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default SupportModal;
