import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Paper,
  Grid,
  Button,
  Avatar,
  Chip
} from '@mui/material';
import {
  Close,
  Code,
  Add,
  Timeline,
  Info
} from '@mui/icons-material';

interface AnalyzeRuleDialogProps {
  open: boolean;
  onClose: () => void;
  nodes: any[];
  edges: any[];
}

const AnalyzeRuleDialog: React.FC<AnalyzeRuleDialogProps> = ({
  open,
  onClose,
  nodes,
  edges
}) => {
  const activeRule = useSelector((state: RootState) => state.rules.activeRule);
  const activeVersion = useSelector((state: RootState) => state.rules.activeVersion);
  
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [ruleSummaryText, setRuleSummaryText] = useState<string | null>(null);

  // Generate AI summary when dialog opens
  useEffect(() => {
    if (open && !generatingSummary && !ruleSummaryText) {
      generateRuleSummary();
    }
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setGeneratingSummary(false);
      setRuleSummaryText(null);
    }
  }, [open]);

  const generateRuleSummary = () => {
    setGeneratingSummary(true);
    
    // Simulate AI generating a summary based on the rule structure
    setTimeout(() => {
      // Create an intelligent summary based on the rule's structure
      const decisionNodes = nodes.filter(node => node.type === 'diamond');
      const endNodes = nodes.filter(node => 
        node.data?.label === 'End' || 
        (node.type === 'circle' && node.id !== 'start')
      );
      
      // Extract decision points and labeled edges
      const decisionPoints = decisionNodes.map(node => node.data?.label || 'Decision').join(', ');
      const thresholds = edges.filter(edge => edge.label).map(edge => edge.label).join(', ');
      
      // Construct the rule summary based on structure
      let summary = `This rule "${activeRule?.name}" (version ${activeVersion?.version}) `;
      
      if (decisionNodes.length > 0) {
        summary += `evaluates ${decisionNodes.length} key decision points `;
        if (decisionPoints) {
          summary += `including ${decisionPoints}. `;
        } else {
          summary += `. `;
        }
      }
      
      if (edges.filter(edge => edge.label).length > 0) {
        summary += `It includes conditional paths based on thresholds such as ${thresholds}. `;
      }
      
      if (endNodes.length > 1) {
        summary += `The rule can result in ${endNodes.length} different outcomes depending on the evaluation path. `;
      } else {
        summary += `The rule leads to a single outcome after evaluation. `;
      }
      
      // Add context-specific insights based on node labels
      const diabetesRelated = nodes.some(node => 
        node.data?.label && 
        node.data.label.toLowerCase().includes('diabetes')
      );
      
      const sleepApneaRelated = nodes.some(node => 
        node.data?.label && 
        (node.data.label.toLowerCase().includes('sleep') || node.data.label.toLowerCase().includes('apnea'))
      );
      
      const bmiRelated = nodes.some(node => 
        node.data?.label && 
        node.data.label.toLowerCase().includes('bmi')
      );
      
      if (diabetesRelated || sleepApneaRelated || bmiRelated) {
        summary += `This rule appears to be evaluating health conditions including `;
        const conditions = [];
        if (diabetesRelated) conditions.push('diabetes');
        if (sleepApneaRelated) conditions.push('sleep apnea');
        if (bmiRelated) conditions.push('BMI');
        
        summary += conditions.join(', ');
        summary += ` to determine appropriate underwriting actions. `;
      }
      
      summary += `\n\nThis rule design follows ${
        nodes.length > 10 ? 'a complex' : 'a straightforward'
      } decision tree structure with ${nodes.length} nodes and ${edges.length} connections. `;
      
      summary += `\n\nRecommendation: ${
        decisionNodes.length > 5 
          ? 'Consider simplifying some decision paths to improve rule readability and maintenance.' 
          : 'The current design has good balance between complexity and readability.'
      }`;
      
      setRuleSummaryText(summary);
      setGeneratingSummary(false);
    }, 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ 
        style: { 
          borderRadius: '12px',
          overflow: 'hidden'
        } 
      }}
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
          <Code sx={{ color: '#5569ff', marginRight: 1.5 }} />
          <Typography variant="h6" fontWeight={600}>
            Analyze Rule
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          size="small"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ padding: '24px' }}>
        {/* Generated Rule Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            AI-Generated Rule Summary
          </Typography>
          
          {generatingSummary ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              py: 3
            }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Analyzing rule structure and generating summary...
              </Typography>
            </Box>
          ) : ruleSummaryText ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid rgba(85, 105, 255, 0.2)',
                bgcolor: 'rgba(85, 105, 255, 0.03)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                <Chip 
                  label="AI-generated" 
                  size="small" 
                  sx={{ 
                    height: 20, 
                    fontSize: '0.65rem', 
                    bgcolor: 'rgba(85, 105, 255, 0.1)', 
                    color: '#5569ff',
                    fontWeight: 500
                  }} 
                />
              </Box>
              
              <Typography variant="body1" sx={{ 
                whiteSpace: 'pre-line',
                lineHeight: 1.7
              }}>
                {ruleSummaryText}
              </Typography>
            </Paper>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Unable to generate summary. Please try again.
            </Typography>
          )}
        </Box>

        {/* Upcoming Features */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
          Upcoming Rule AI Features
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid #e6f0ff',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(85, 105, 255, 0.1)', 
                  color: '#5569ff',
                  width: 40,
                  height: 40,
                  mr: 1.5
                }}>
                  <Code fontSize="small" />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Rule Optimization
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Automatically analyze rule flows to identify redundancies, circular paths, or dead ends.
                Get suggestions for simplifying complex decision trees without changing their logic.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid #e6f0ff',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(0, 171, 85, 0.1)', 
                  color: '#00ab55',
                  width: 40,
                  height: 40,
                  mr: 1.5
                }}>
                  <Timeline fontSize="small" />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Path Analysis
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Analyze the most common paths through your rule based on real-world data.
                Identify edge cases and understand how frequently each decision branch is traversed.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid #e6f0ff',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255, 193, 7, 0.1)', 
                  color: '#ffc107',
                  width: 40,
                  height: 40,
                  mr: 1.5
                }}>
                  <Info fontSize="small" />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Natural Language Generation
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Automatically generate human-readable documentation that explains rule logic in plain language.
                Create business glossaries from your rules to maintain consistent terminology.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ 
        padding: '16px 24px', 
        borderTop: '1px solid #f0f0f0'
      }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          sx={{ borderRadius: '8px' }}
        >
          Close
        </Button>
        <Button 
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
          }}
          onClick={() => window.location.href = "mailto:mqazi@munichre.com?subject=alitheia Labs Support | Get Access to Rule AI"}
        >
          Get Access
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalyzeRuleDialog;