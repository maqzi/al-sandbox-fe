import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Update the imports at the top to include new components
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  DialogContentText, TableContainer, Table, TableHead, TableBody, TableCell, 
  TableRow, Typography, Chip, Paper, Box, Divider, Card, CardContent,
  IconButton, Tooltip, Badge, Select, MenuItem, FormControl,
  InputLabel, TextField, ListItemText, Checkbox, FormHelperText,
  List, ListItem, ListItemIcon, RadioGroup, FormControlLabel, Radio,
  OutlinedInput, Stepper, Step, StepLabel
} from '@mui/material';
import { 
  Lock, Edit, PlayArrow, CheckCircle, History, Close, Add, 
  MoreVert, Info, Star, StarBorder, FilterList, AutoFixHigh,
  CloudUpload, DescriptionOutlined, SmartToy, CreateNewFolder
} from '@mui/icons-material';
import { RootState } from '@/store/store';
import Whiteboard from '@/components/Whiteboard';
import { Rule, RuleVersion, setActiveRule, setActiveVersion, updateRuleActiveVersion } from '@/store/rulesSlice';

// First, import the recommendations data
import ruleRecommendations from '@/data/rulesRecommendations.json';

// Import Datadog logging library
import datadog from '@/lib/datadog';

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
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [createRuleDialogOpen, setCreateRuleDialogOpen] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  
  const [createMode, setCreateMode] = useState<'manual' | 'ai' | null>(null);
  const [selectedManual, setSelectedManual] = useState<string>("");
  const [selectedImpairments, setSelectedImpairments] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // Add this state for rule generation feedback
  const [generationStatus, setGenerationStatus] = useState<{
    phase: string;
    message: string;
    progress: number;
  } | null>(null);

  // Log page view on component mount
  useEffect(() => {
    datadog.logPageView('rules_designer', {
      activeStep,
      createMode
    });
  }, []);

  // Set the selected rule at component mount
  useEffect(() => {
    if (rules.length > 0) {
      const firstRule = rules[0];
      setSelectedRule(firstRule);
    }
  }, [rules]);

  // Memoize handlers with useCallback to prevent unnecessary re-renders
  const handleRuleClick = useCallback((rule: Rule) => {
    setSelectedRule(rule);
  }, []);

  const handleHistoryClick = useCallback((rule: Rule, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRule(rule);
    setHistoryDialogOpen(true);
  }, []);

  const handleVersionSelect = useCallback((rule: Rule, version: RuleVersion) => {
    // Update the active version in Redux state
    dispatch(updateRuleActiveVersion({ ruleId: rule.id, versionId: version.version }));
    setHistoryDialogOpen(false);
  }, [dispatch]);

  const handlePlayClick = useCallback((rule: Rule) => {
    // Find the active version for this rule
    const activeVersion = rule.versions.find(v => v.version === rule.activeVersionId) || 
                         rule.versions.find(v => v.tag === 'latest') || 
                         (rule.versions.length > 0 ? rule.versions[0] : null);
    
    if (activeVersion) {
      dispatch(setActiveRule(rule));
      dispatch(setActiveVersion(activeVersion));
      setShowWhiteboard(true);
    }
  }, [dispatch]);

  const handleCloseWhiteboard = useCallback(() => {
    setShowWhiteboard(false);
    dispatch(setActiveRule(null));
    dispatch(setActiveVersion(null));
  }, [dispatch]);

  // Get active version for a rule
  const getActiveVersion = useCallback((rule: Rule): RuleVersion | null => {
    if (rule.activeVersionId) {
      return rule.versions.find(v => v.version === rule.activeVersionId) || null;
    }
    
    // Fallback to latest version if no active version is set
    const latestVersion = rule.versions.find(v => v.tag === 'latest');
    return latestVersion || (rule.versions.length > 0 ? rule.versions[0] : null);
  }, []);
  
  // Move the handleGenerateRule function inside the component
  const handleGenerateRule = useCallback(() => {
    setIsGenerating(true);
    setGenerationStatus({ phase: 'init', message: 'Initializing rule generation...', progress: 10 });
    
    // Create rule name based on selected impairments
    const ruleName = `${selectedImpairments.map(imp => 
      imp.charAt(0).toUpperCase() + imp.slice(1).replace('_', ' ')
    ).join(' + ')} Risk Assessment`;
    
    // Generate a unique ID
    const newRuleId = `R-${Math.floor(Math.random() * 10000)}`;
    
    // Simulate the multi-step generation process
    setTimeout(() => {
      setGenerationStatus({ 
        phase: 'searching', 
        message: 'Searching for rule templates...', 
        progress: 30 
      });
      
      // Find matching rule templates from recommendations
      const matchingTemplates: any[] = [];
      
      selectedImpairments.forEach(impairment => {
        // Find a template that matches the impairment
        const template = ruleRecommendations.rules.find(rule => 
          rule.name.toLowerCase() === impairment.replace('_', ' ')
        );
        if (template) {
          matchingTemplates.push(template);
        }
      });
      
      setTimeout(() => {
        // Get the first matching template or use a default one
        const selectedTemplate = matchingTemplates.length > 0 
          ? matchingTemplates[0] 
          : null;
          
        setGenerationStatus({ 
          phase: selectedTemplate ? 'adapting' : 'creating', 
          message: selectedTemplate 
            ? `Found ${selectedTemplate.name} template! Adapting to your requirements...` 
            : 'Creating a new rule from scratch...', 
          progress: 60 
        });
        
        setTimeout(() => {
          setGenerationStatus({ 
            phase: 'finalizing', 
            message: 'Finalizing rule definition...', 
            progress: 90 
          });
          
          setTimeout(() => {
            // Create a new rule object using the template if available
            const newRule: Rule = {
              id: newRuleId,
              name: ruleName,
              description: `Automatically generated rule for ${selectedImpairments.join(', ')} from ${selectedManual}`,
              activeVersionId: '1.0.0',
              versions: [
                {
                  version: '1.0.0',
                  tag: 'latest',
                  note: `Initial version generated by Rule AI using ${selectedManual}`,
                  nodes: selectedTemplate ? selectedTemplate.versions[0].nodes : [
                    {
                      id: 'start',
                      type: 'start',
                      data: { label: 'Start' },
                      position: { x: 250, y: 5 }
                    },
                    {
                      id: 'condition',
                      type: 'condition',
                      data: { 
                        label: `Check ${selectedImpairments.join(' & ')}`, 
                        condition: `has_condition(${selectedImpairments.join(')} || has_condition(')})` 
                      },
                      position: { x: 250, y: 100 }
                    },
                    {
                      id: 'action',
                      type: 'action',
                      data: { 
                        label: 'Set Risk Class', 
                        action: 'risk_class = "Standard"'
                      },
                      position: { x: 250, y: 200 }
                    },
                    {
                      id: 'end',
                      type: 'end',
                      data: { label: 'End' },
                      position: { x: 250, y: 300 }
                    }
                  ],
                  edges: selectedTemplate ? selectedTemplate.versions[0].edges : [
                    {
                      id: 'e-start-condition',
                      source: 'start',
                      target: 'condition',
                      type: 'smoothstep'
                    },
                    {
                      id: 'e-condition-action',
                      source: 'condition',
                      target: 'action',
                      type: 'smoothstep',
                      label: 'Yes'
                    },
                    {
                      id: 'e-action-end',
                      source: 'action',
                      target: 'end',
                      type: 'smoothstep'
                    }
                  ]
                }
              ]
            };
            
            // Dispatch the action to add the new rule to the Redux store
            dispatch({ type: 'rules/addRule', payload: newRule });
            
            setGenerationStatus({ 
              phase: 'complete', 
              message: 'Rule successfully generated!', 
              progress: 100 
            });
            
            // Log rule generation
            datadog.log({
              action: 'generate_rule',
              category: 'rules_designer',
              label: ruleName,
              additionalData: {
                ruleId: newRuleId,
                impairments: selectedImpairments,
                manual: selectedManual
              }
            });
            
            // Final delay before closing
            setTimeout(() => {
              // Close the dialog and reset state
              setCreateRuleDialogOpen(false);
              setCreateMode(null);
              setSelectedManual("");
              setSelectedImpairments([]);
              setActiveStep(0);
              setIsGenerating(false);
              setGenerationStatus(null);
              
              // Set the newly created rule as selected and active
              setSelectedRule(newRule);
              dispatch(setActiveRule(newRule));
              dispatch(setActiveVersion(newRule.versions[0]));
              
              // Show the whiteboard after rule generation
              setShowWhiteboard(true);
            }, 1000);
            
          }, 800);
        }, 1200);
      }, 1000);
    }, 800);
  }, [dispatch, selectedImpairments, selectedManual]);

  // Computed values
  const lockedRuleNames = rules
    .filter(rule => !rule.versions || rule.versions.length === 0)
    .map(rule => rule.name);

  // If whiteboard is shown, render the Whiteboard component
  if (showWhiteboard && activeRule && activeVersion) {
    return (
      <Whiteboard onClose={handleCloseWhiteboard} />
    );
  }

  // Otherwise, render the rules table
  return (
    <Box className="p-4" sx={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      <Card sx={{ 
        marginBottom: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        borderRadius: 2
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Rules Designer
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Filter rules">
                <IconButton>
                  <FilterList />
                </IconButton>
              </Tooltip>
              
              <Button 
                onClick={() => setCreateRuleDialogOpen(true)} 
                variant="contained" 
                color="primary"
                startIcon={<Add />}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(85, 105, 255, 0.2)'
                }}
              >
                Create New Rule
              </Button>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
            Design and manage rule trees for your program.
          </Typography>
          
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eaedf3' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Rule ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rule Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Active Version</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map((rule) => {
                  const isLocked = lockedRuleNames.includes(rule.name);
                  const isSelected = selectedRule?.id === rule.id;
                  const activeRuleVersion = getActiveVersion(rule);
                  
                  return (
                    <TableRow 
                      key={rule.id} 
                      sx={{ 
                        cursor: !isLocked ? 'pointer' : 'default',
                        '&:hover': !isLocked ? { backgroundColor: '#f5f9ff' } : {},
                        backgroundColor: isSelected ? 'rgba(85, 105, 255, 0.04)' : 'inherit',
                        borderLeft: isSelected ? '4px solid #5569ff' : '4px solid transparent'
                      }}
                      onClick={() => !isLocked && handleRuleClick(rule)}
                    >
                      <TableCell sx={{ color: isLocked ? '#a0a5b9' : 'inherit' }}>
                        {rule.id}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {isLocked ? (
                            <Tooltip title="This rule is locked">
                              <Lock sx={{ color: '#a0a5b9', marginRight: 1, fontSize: 20 }} />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Active rule">
                              <Star sx={{ color: '#ffc107', marginRight: 1, fontSize: 20 }} />
                            </Tooltip>
                          )}
                          <Typography
                            sx={{ 
                              fontWeight: isSelected ? 600 : 400,
                              color: isLocked ? '#a0a5b9' : 'inherit'
                            }}
                          >
                            {rule.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {activeRuleVersion ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label={activeRuleVersion.version}
                              size="small" 
                              color={activeRuleVersion.tag === 'latest' ? 'primary' : 'default'}
                              sx={{ 
                                borderRadius: '4px', 
                                marginRight: 1,
                                fontWeight: 500
                              }} 
                            />
                            <Tooltip title="View version history">
                              <IconButton 
                                size="small"
                                onClick={(e) => handleHistoryClick(rule, e)}
                                sx={{ 
                                  color: '#5569ff', 
                                  backgroundColor: 'rgba(85, 105, 255, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(85, 105, 255, 0.2)' }
                                }}
                              >
                                <History fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Typography color="text.secondary" variant="body2">
                            No version available
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {!isLocked ? (
                          <Tooltip title="Open editor">
                            <IconButton
                              onClick={() => handlePlayClick(rule)}
                              sx={{ 
                                color: '#5569ff', 
                                backgroundColor: 'rgba(85, 105, 255, 0.1)',
                                '&:hover': { backgroundColor: 'rgba(85, 105, 255, 0.2)' }
                              }}
                            >
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Chip 
                            label="Locked" 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              borderRadius: '4px',
                              color: '#a0a5b9',
                              borderColor: '#a0a5b9'
                            }}
                            icon={<Lock style={{ fontSize: 14 }} />}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No rules available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Version History Dialog with Highlighted Selected Version */}
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
            {selectedRule?.versions.map((version, index) => {
              const isActiveVersion = selectedRule.activeVersionId === version.version;
              
              return (
                <Paper
                  key={version.version}
                  elevation={1}
                  sx={{ 
                    marginBottom: 2, 
                    padding: 2, 
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    border: isActiveVersion ? '2px solid #5569ff' : '1px solid #e0e0e0',
                    boxShadow: isActiveVersion ? '0 0 0 2px rgba(85, 105, 255, 0.2)' : 'none',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: isActiveVersion 
                        ? '0 4px 8px rgba(85, 105, 255, 0.2)' 
                        : '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                  onClick={() => handleVersionSelect(selectedRule, version)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <Typography variant="h6" component="span" sx={{ fontWeight: 600, marginRight: 1 }}>
                          v{version.version}
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
                      variant={isActiveVersion ? "contained" : "outlined"}
                      color="primary"
                      size="small"
                      sx={{ 
                        borderRadius: '20px',
                        textTransform: 'none',
                        minWidth: '100px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVersionSelect(selectedRule, version);
                      }}
                    >
                      {isActiveVersion ? (
                        <>
                          <CheckCircle sx={{ marginRight: 0.5, fontSize: '16px' }} />
                          Selected
                        </>
                      ) : 'Select'}
                    </Button>
                  </Box>
                </Paper>
              );
            })}
            
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

      {/* Create Rule Dialog (unchanged) */}
      {/* Create Rule Dialog - Enhanced with AI options */}
<Dialog 
  open={createRuleDialogOpen} 
  onClose={() => {
    setCreateRuleDialogOpen(false);
    setCreateMode(null);
    setSelectedManual("");
    setSelectedImpairments([]);
    setActiveStep(0);
    setIsGenerating(false);
  }}
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
      <Add sx={{ marginRight: 1, color: '#5569ff' }} />
      <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
        Create New Rule
      </Typography>
    </Box>
    <Button 
      onClick={() => {
        setCreateRuleDialogOpen(false);
        setCreateMode(null);
        setSelectedManual("");
        setSelectedImpairments([]);
        setActiveStep(0);
        setIsGenerating(false);
      }}
      sx={{ minWidth: '36px', padding: '6px' }}
    >
      <Close />
    </Button>
  </DialogTitle>

  <DialogContent sx={{ padding: '24px' }}>
    {/* Step Indicator */}
    {createMode === 'ai' && (
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        <Step>
          <StepLabel>Select Source</StepLabel>
        </Step>
        <Step>
          <StepLabel>Select Impairments</StepLabel>
        </Step>
        <Step>
          <StepLabel>Generate Rule</StepLabel>
        </Step>
      </Stepper>
    )}
    
    {/* Mode Selection */}
    {!createMode && (
      <Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Choose how to create your new rule:
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Manual Creation Option - Locked */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: 0.7,
              cursor: 'not-allowed',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.7)',
                zIndex: 1,
                borderRadius: 2,
              }}
            >
              <Chip 
                icon={<Lock />} 
                label="Coming Soon" 
                color="default" 
                sx={{ 
                  fontWeight: 600,
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
            
            <CreateNewFolder sx={{ fontSize: 60, mb: 2, color: '#5569ff' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Start From Scratch
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
              Build your rule tree manually using our visual editor.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              disabled
              fullWidth
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Create Manually
            </Button>
          </Paper>
          
          {/* AI Creation Option */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              border: '2px solid transparent',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#5569ff',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(85, 105, 255, 0.2)'
              }
            }}
            onClick={() => setCreateMode('ai')}
          >
            <SmartToy sx={{ fontSize: 60, mb: 2, color: '#5569ff' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Use Rule AI
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
              Generate rules automatically from underwriting guidelines.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<AutoFixHigh />}
              onClick={() => setCreateMode('ai')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Get Started with AI
            </Button>
          </Paper>
        </Box>
      </Box>
    )}
    
    {/* Step 1: Select Underwriting Manual */}
    {createMode === 'ai' && activeStep === 0 && (
      <Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Select a source underwriting manual:
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="manual-select-label">Underwriting Manual</InputLabel>
          <Select
            labelId="manual-select-label"
            value={selectedManual}
            onChange={(e) => setSelectedManual(e.target.value as string)}
            label="Underwriting Manual"
          >
            <MenuItem value="munich_re_23">Munich Re - Medical UW Manual 2023</MenuItem>
            <MenuItem value="munich_re_24">Munich Re - Medical UW Manual 2024</MenuItem>
            <MenuItem value="upload">Upload Custom Manual...</MenuItem>
          </Select>
          <FormHelperText>
            Select an underwriting manual to extract rules from.
          </FormHelperText>
        </FormControl>
        
        {selectedManual === "upload" && (
          <Box 
            sx={{ 
              border: '2px dashed #c0c8d2', 
              borderRadius: 2, 
              p: 3, 
              textAlign: 'center',
              backgroundColor: '#f5f7fa',
              mb: 3
            }}
          >
            <CloudUpload sx={{ fontSize: 48, color: '#5569ff', mb: 1 }} />
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Upload Underwriting Manual
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              PDF, DOCX, or TXT files up to 50MB
            </Typography>
            <Button 
              variant="outlined" 
              color="default" 
              startIcon={<Lock />}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Select File (Locked)
            </Button>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined"
            color="primary"
            onClick={() => setCreateMode(null)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
          <Button 
            variant="contained"
            color="primary"
            disabled={!selectedManual}
            onClick={() => setActiveStep(1)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Next
          </Button>
        </Box>
      </Box>
    )}
    
    {/* Step 2: Select Impairments */}
    {createMode === 'ai' && activeStep === 1 && (
      <Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Select impairments for rule generation:
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="impairments-label">Impairments</InputLabel>
            <Select
            labelId="impairments-label"
            value={selectedImpairments[0] || ''}
            onChange={(e) => setSelectedImpairments([e.target.value as string])}
            input={<OutlinedInput label="Impairments" />}
            >
            {/* Available Impairments */}
            <MenuItem value="hypertension">
              <Checkbox checked={selectedImpairments.indexOf('hypertension') > -1} />
              <ListItemText 
                primary="Hypertension" 
                secondary="Blood pressure exceeding 140/90 mm Hg"
              />
            </MenuItem>
            
            <MenuItem value="brca">
              <Checkbox checked={selectedImpairments.indexOf('brca') > -1} />
              <ListItemText 
                primary="BRCA Mutation" 
                secondary="BRCA1/2 gene mutations or family history of breast/ovarian cancer"
              />
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            {/* Locked Impairments */}
            <MenuItem disabled sx={{ opacity: 0.7, cursor: 'not-allowed' }}>
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  More impairments coming soon
                </Typography>
                <Chip 
                  icon={<Lock fontSize="small" />} 
                  label="Coming Soon" 
                  size="small" 
                  variant="outlined"
                  sx={{ ml: 2 }}
                />
              </Box>
            </MenuItem>
            
            <MenuItem disabled sx={{ opacity: 0.7, cursor: 'not-allowed' }}>
              <Checkbox disabled />
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Diabetes
                    <Chip 
                      icon={<Lock fontSize="small" />} 
                      label="Coming Soon" 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary="Type 1 or Type 2 diabetes mellitus"
              />
            </MenuItem>
            
            <MenuItem disabled sx={{ opacity: 0.7, cursor: 'not-allowed' }}>
              <Checkbox disabled />
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Hypercholesterolemia
                    <Chip 
                      icon={<Lock fontSize="small" />} 
                      label="Coming Soon" 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary="High total cholesterol or LDL levels"
              />
            </MenuItem>
            
            <MenuItem disabled sx={{ opacity: 0.7, cursor: 'not-allowed' }}>
              <Checkbox disabled />
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Obesity
                    <Chip 
                      icon={<Lock fontSize="small" />} 
                      label="Coming Soon" 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary="BMI exceeding 30 kg/m²"
              />
            </MenuItem>
            
            <MenuItem disabled sx={{ opacity: 0.7, cursor: 'not-allowed' }}>
              <Checkbox disabled />
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Sleep Apnea
                    <Chip 
                      icon={<Lock fontSize="small" />} 
                      label="Coming Soon" 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary="Obstructive or central sleep apnea"
              />
            </MenuItem>
            
            <MenuItem disabled sx={{ opacity: 0.7, cursor: 'not-allowed' }}>
              <Checkbox disabled />
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Tobacco Use
                    <Chip 
                      icon={<Lock fontSize="small" />} 
                      label="Coming Soon" 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary="Current or former tobacco user"
              />
            </MenuItem>
          </Select>
          <FormHelperText>
            Select one or more impairments to create rules for. 
          </FormHelperText>
        </FormControl>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined"
            color="primary"
            onClick={() => setActiveStep(0)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
          <Button 
            variant="contained"
            color="primary"
            disabled={selectedImpairments.length === 0}
            onClick={() => setActiveStep(2)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Next
          </Button>
        </Box>
      </Box>
    )}
    
    {/* Step 3: Generate Rule */}
    {createMode === 'ai' && activeStep === 2 && (
      <Box>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Review your selections and generate your rule:
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f7fa', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Selected Source:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedManual === "standard_life" && "Standard Life - Individual UW Guidelines 2024"}
            {selectedManual === "munich_re" && "Munich Re - Medical UW Manual 2023"}
            {selectedManual === "swiss_re" && "Swiss Re - Life Guide 2024"}
            {selectedManual === "hannover_re" && "Hannover Re - Medical UW Guidelines 2023"}
            {selectedManual === "upload" && "Custom Uploaded Manual"}
          </Typography>
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Selected Impairments:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {selectedImpairments.map((impairment) => (
              <Chip 
                key={impairment} 
                label={impairment.charAt(0).toUpperCase() + impairment.slice(1).replace('_', ' ')} 
                size="small"
                color="primary"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Generated Rule Name:
          </Typography>
          <Typography variant="body2">
            {selectedImpairments.map(imp => 
              imp.charAt(0).toUpperCase() + imp.slice(1).replace('_', ' ')
            ).join(' + ')} Risk Assessment
          </Typography>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined"
            color="primary"
            onClick={() => setActiveStep(1)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
          <Button 
            variant="contained"
            color="primary"
            startIcon={<AutoFixHigh />}
            disabled={isGenerating}
            onClick={handleGenerateRule}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.2)'
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Rule'}
          </Button>
        </Box>
      </Box>
    )}
  </DialogContent>
  
  {(!createMode || activeStep !== 2) && (
    <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => {
          setCreateRuleDialogOpen(false);
          setCreateMode(null);
          setSelectedManual("");
          setSelectedImpairments([]);
          setActiveStep(0);
        }}
      >
        Cancel
      </Button>
    </DialogActions>
  )}
</Dialog>
    </Box>
  );
};

export default RulesDesignerPage;