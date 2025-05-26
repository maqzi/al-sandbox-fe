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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Button
} from '@mui/material';
import {
  Close,
  PlayArrow,
  CheckCircle,
  Lock,
  Add
} from '@mui/icons-material';

interface TestResults {
  overall: {
    stp: number;
    accuracy: number;
    resourceUtilization: number;
    averageProcessingTime: number;
  };
  cases: Array<{
    id: string;
    name: string;
    result: string;
    outcome: 'approved' | 'rejected' | 'referred';
    processingTime: number;
    risk: 'low' | 'medium' | 'high';
  }>;
}

interface TestRuleDialogProps {
  open: boolean;
  onClose: () => void;
  onTestComplete?: (results: TestResults) => void;
}

const TestRuleDialog: React.FC<TestRuleDialogProps> = ({
  open,
  onClose,
  onTestComplete
}) => {
  const activeRule = useSelector((state: RootState) => state.rules.activeRule);
  const activeVersion = useSelector((state: RootState) => state.rules.activeVersion);
  
  const [testingInProgress, setTestingInProgress] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  // Move determineOutcome function here
  const determineOutcome = (result: string) => {
    let riskFactors = [];
    let a1c = null;
    let bmi = null;
    let ahi = null;
    let systolic = null;
    let diastolic = null;
    let brca = false;
    let cpapCompliant = true;
    const ruleName = activeRule?.name?.toLowerCase() || '';

    // Parse the result string
    const parts = result.split(', ');
    parts.forEach(part => {
      if (part.startsWith('A1c:')) {
        a1c = parseFloat(part.split(': ')[1].replace('%', ''));
      } else if (part.startsWith('BMI:')) {
        bmi = parseFloat(part.split(': ')[1]);
      } else if (part.startsWith('Sleep Apnea: AHI')) {
        const ahiString = part.split(': ')[1];
        if (ahiString.includes('>')) {
          ahi = parseFloat(ahiString.replace('AHI > ', ''));
        } else if (ahiString.includes('-')) {
          const range = ahiString.replace('AHI ', '').split('-');
          ahi = (parseFloat(range[0]) + parseFloat(range[1])) / 2; // Average of range
        }
      } else if (part.startsWith('Blood Pressure:')) {
        const bp = part.split(': ')[1].split('/');
        systolic = parseFloat(bp[0]);
        diastolic = parseFloat(bp[1]);
      } else if (part.startsWith('BRCA:')) {
        brca = part.split(': ')[1] === 'Positive';
      } else if (part.startsWith('No CPAP Compliance')) {
        cpapCompliant = false;
      }
    });

    // Evaluate risk factors based on parsed values
    if (a1c !== null && a1c > 7.0) { // Diabetes is part of the default program
      riskFactors.push('Elevated A1c');
    }
    if (bmi !== null && bmi > 30.0) {
      riskFactors.push('Elevated BMI');
    }
    if (ahi !== null && ahi > 30.0 && ruleName === 'obstructive sleep apnea') {
      riskFactors.push('Severe Sleep Apnea');
    }
    if (systolic !== null && diastolic !== null && (systolic >= 140 || diastolic >= 90) && ruleName === 'hypertension risk assessment') {
      riskFactors.push('Elevated Blood Pressure');
    }
    if (brca && ruleName === 'brca risk assessment') {
      riskFactors.push('BRCA Positive');
    }
    if (ahi !== null && ahi > 30 && !cpapCompliant && ruleName === 'obstructive sleep apnea') {
      riskFactors.push('Severe Sleep Apnea Non Compliant');
    }

    // Determine outcome based on risk factors
    if (riskFactors.length > 2) {
      return 'rejected'; // High risk: Multiple significant factors
    } else if (riskFactors.length == 2) {
      return 'referred'; // Medium risk: Two significant factors
    } else if (riskFactors.includes('BRCA Positive')) {
      return 'referred'; // BRCA positive is a strong risk even alone
    } else if (riskFactors.includes('Elevated Blood Pressure')) {
      return 'referred';
    } else {
      return 'approved'; // Low risk: Minimal or no significant factors
    }
  };

  // Move test cases data here
  const getTestCases = () => [
    {
      id: 'CASE-2023-0001',
      name: 'John Smith',
      result: 'A1c: 6.1%, BMI: 22.5, Sleep Apnea: AHI > 30, Blood Pressure: 140/90, BRCA: Negative',
      risk: 'medium' as const,
    },
    {
      id: 'CASE-2023-0002',
      name: 'Emma Johnson',
      result: 'A1c: 5.5%, BMI: 24.3, No Sleep Apnea, Blood Pressure: 120/80, BRCA: Positive',
      risk: 'low' as const,
    },
    {
      id: 'CASE-2023-0003',
      name: 'Michael Brown',
      result: 'A1c: 8.1%, BMI: 35.2, Sleep Apnea: AHI > 30, No CPAP Compliance, Blood Pressure: 120/75, BRCA: Negative',
      risk: 'high' as const,
    },
    {
      id: 'CASE-2023-0004',
      name: 'Sarah Williams',
      result: 'A1c: 6.2%, BMI: 27.8, Sleep Apnea: AHI 5-15, CPAP Compliant, Blood Pressure: 130/85, BRCA: Positive',
      risk: 'medium' as const,
    },
    {
      id: 'CASE-2023-0005',
      name: 'David Miller',
      result: 'A1c: 9.3%, BMI: 36.7, Sleep Apnea: AHI > 30, Blood Pressure: 160/100, BRCA: Positive',
      risk: 'high' as const,
    }
  ];

  // Move test logic here
  const runTest = () => {
    setTestingInProgress(true);
    setTestResults(null);

    // Simulate rule testing with sample data
    setTimeout(() => {
      const testCases = getTestCases();
      const cases = testCases.map(testCase => ({
        ...testCase,
        outcome: determineOutcome(testCase.result) as 'approved' | 'rejected' | 'referred',
        processingTime: Math.floor((300 + Math.random() * 180) / 60), // 5-8 minutes
      }));

      const totalApproved = cases.filter(c => c.outcome === 'approved').length;
      const totalCases = cases.length;
      const avgProcessingTime = cases.reduce((sum, c) => sum + c.processingTime, 0) / totalCases;

      const results = {
        overall: {
          stp: Math.floor((totalApproved / totalCases) * 100),
          accuracy: Math.floor(90 + Math.random() * 9),
          resourceUtilization: Math.floor(60 + Math.random() * 30),
          averageProcessingTime: Math.ceil(avgProcessingTime),
        },
        cases
      };

      setTestResults(results);
      setTestingInProgress(false);
      
      // Call the callback to pass results back to parent
      if (onTestComplete) {
        onTestComplete(results);
      }
    }, 2000);
  };

  // Auto-start test when dialog opens
  useEffect(() => {
    if (open && !testingInProgress && !testResults) {
      runTest();
    }
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTestingInProgress(false);
      setTestResults(null);
    }
  }, [open]);

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
          <PlayArrow sx={{ color: '#5569ff', marginRight: 1.5 }} />
          <Typography variant="h6" fontWeight={600}>
            Rule Test Results
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
        {testingInProgress ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 4
          }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Testing Rule on Sample Cases
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Running {activeRule?.name} (Version {activeVersion?.version}) against 5 sample cases...
            </Typography>
          </Box>
        ) : testResults ? (
          <React.Fragment>
            {/* Rule Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Test Summary
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'rgba(85, 105, 255, 0.03)', border: '1px solid rgba(85, 105, 255, 0.1)', borderRadius: 2 }}>
                <Typography variant="body2">
                  This report shows the projected performance metrics if this version of the rule ({activeVersion?.version}) 
                  was deployed to production, while keeping all other rules constant. The metrics below are derived from testing 
                  against a sample of real cases.
                </Typography>
              </Paper>
            </Box>

            {/* Overall metrics */}
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Business Impact Metrics
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e6f0ff',
                      height: '100%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                      <CircularProgress
                        variant="determinate"
                        value={testResults.overall.stp}
                        size={80}
                        thickness={4}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          color="text.primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {testResults.overall.stp}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600 }}>
                      Straight-Through Processing
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center">
                      Cases processed without manual review
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e6f0ff',
                      height: '100%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                      <CircularProgress
                        variant="determinate"
                        value={testResults.overall.accuracy}
                        size={80}
                        thickness={4}
                        sx={{ color: '#00ab55' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          color="text.primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {testResults.overall.accuracy}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600 }}>
                      Accuracy
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center">
                      Correct risk assessments vs. expert review
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e6f0ff',
                      height: '100%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                      <CircularProgress
                        variant="determinate"
                        value={testResults.overall.resourceUtilization}
                        size={80}
                        thickness={4}
                        sx={{ color: '#ff9800' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          color="text.primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {testResults.overall.resourceUtilization}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600 }}>
                      Resource Optimization
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center">
                      Underwriter capacity freed up
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e6f0ff',
                      height: '100%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ display: 'inline-flex', mb: 1 }}>
                      <Typography
                        variant="h4"
                        component="div"
                        color="text.primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {testResults.overall.averageProcessingTime}
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ ml: 0.5, fontWeight: 500, color: 'text.secondary', verticalAlign: 'bottom' }}
                        >
                          min
                        </Typography>
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600 }}>
                      Avg. Processing Time
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center">
                      Per case processing speed
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Case Results Table */}
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Sample Case Results
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Case ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Case Details</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Result</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testResults.cases.map((caseItem) => (
                    <TableRow key={caseItem.id} sx={{ '&:hover': { bgcolor: '#f8faff' } }}>
                      <TableCell>{caseItem.id}</TableCell>
                      <TableCell>{caseItem.name}</TableCell>
                      <TableCell>{caseItem.result}</TableCell>
                      <TableCell>
                        <Chip
                          label={caseItem.outcome === 'approved' ? 'Approved' : caseItem.outcome === 'rejected' ? 'Rejected' : 'Referred'}
                          size="small"
                          color={caseItem.outcome === 'approved' ? 'success' : caseItem.outcome === 'rejected' ? 'error' : 'warning'}
                          sx={{ 
                            fontWeight: 500, 
                            fontSize: '0.7rem', 
                            height: 20,
                            borderRadius: 1
                          }}
                        />
                      </TableCell>
                      <TableCell>{caseItem.processingTime} min</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Recommendations */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Recommendations
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: '1px solid rgba(0, 171, 85, 0.2)',
                  bgcolor: 'rgba(0, 171, 85, 0.04)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircle sx={{ color: '#00ab55', mr: 1.5, mt: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#00ab55' }}>
                      Rule Efficiency
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This rule version shows {testResults.overall.stp > 75 ? 'excellent' : 'good'} STP rates. Consider 
                      {testResults.overall.stp < 80 ? ' increasing automation for medium risk cases to improve STP rates further.' : ' maintaining this level of automation in the production version.'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CheckCircle sx={{ color: '#00ab55', mr: 1.5, mt: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#00ab55' }}>
                      Decision Consistency
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      The rule shows high consistency in outcomes for similar risk profiles. This will help maintain fair and 
                      equitable underwriting decisions across all applications.
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ color: '#00ab55', mr: 1.5, mt: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#00ab55' }}>
                      Resource Impact
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This rule configuration would free up approximately {testResults.overall.resourceUtilization}% of underwriter 
                      capacity, allowing focus on complex cases and strategic activities.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </React.Fragment>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 4
          }}>
            <Typography variant="body1" color="text.secondary">
              No test results available.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        padding: '16px 24px', 
        borderTop: '1px solid #f0f0f0'
      }}>
        {!testingInProgress && testResults && (
          <Button 
            startIcon={<Lock />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              mr: 'auto'
            }}
          >
            Export Results
          </Button>
        )}
        <Button 
          onClick={onClose} 
          color="inherit"
          sx={{ borderRadius: '8px' }}
        >
          Close
        </Button>
        {!testingInProgress && testResults && (
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
            onClick={() => window.location.href = "mailto:mqazi@munichre.com?subject=alitheia Labs Support | Get Access to Business Impact Metrics"}
          >
            Get Access
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TestRuleDialog;