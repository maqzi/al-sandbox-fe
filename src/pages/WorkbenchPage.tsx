import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Table, TableBody, TableCell, TableHead, TableRow, Button, Typography,
  Box, Card, CardContent, Chip, Paper, TableContainer,
  Divider, TextField, InputAdornment, Alert, LinearProgress
} from '@mui/material';
import { 
  Search, FilterList, Refresh, CalendarToday, 
  Schedule, ArrowBack 
} from '@mui/icons-material';
import WorkbenchComponent from '@/components/WorkbenchComponent';
import { setStep } from '@/store/userSlice';

interface Case {
  taskId: string;
  policyNum: string;
  queue: string;
  workType: string;
  nextAction: string;
  receivedDate: string;
  dueDate: string;
  priority: string;
  assignmentStatus: string;
}

const WorkbenchPage: React.FC = () => {
  // Use Redux hooks to access state and dispatch
  const dispatch = useDispatch();
  
  // Get data directly from applicantData in Redux store
  const applicantData = useSelector((state: any) => state || {});
  const cases = useSelector((state: any) => state.application.cases || []);
  const workbenchSection = useSelector((state: any) => state.application.workbench.activeSection || 'EHRs');

  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redux action dispatchers
  const handleWorkbenchSectionClick = (section: string) => {
    dispatch(setWorkbenchSection(section));
  };

  const handleSourceClick = (source: string) => {
    dispatch(setActiveSource(source));
  };

  const handleStepChange = (step: number) => {
    dispatch(setStep(step));
  };

  // Local component handlers
  const handleCaseClick = (caseData: Case) => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setSelectedCase(caseData);
      setIsLoading(false);
    }, 800);
  };

  const handleBackClick = () => {
    setSelectedCase(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredCases = cases.filter(caseData => 
    caseData.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseData.policyNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseData.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseData.queue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'assigned': return 'success';
      case 'pending': return 'warning';
      case 'unassigned': return 'error';
      default: return 'default';
    }
  };

  if (selectedCase) {
    return (
      <Box sx={{ padding: '24px', backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
          <Button 
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            sx={{
              marginBottom: '16px',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Back to Cases
          </Button>
          <Paper sx={{ padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Box>
                <Typography variant="h5" sx= {{fontWeight: 600}}>
                  Case {selectedCase.taskId}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                  Policy: {selectedCase.policyNum} • Queue: {selectedCase.queue}
                </Typography>
              </Box>
              <Chip 
                label={selectedCase.workType} 
                color="primary" 
                sx={{ borderRadius: 4, fontWeight: 500 }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Next Action</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                  {selectedCase.nextAction}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption"  sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Received Date</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ fontSize: 14, marginRight: 1 }} />
                  {selectedCase.receivedDate}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption"  sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Due Date</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ fontSize: 14, marginRight: 1 }}/>
                  {selectedCase.dueDate}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption"  sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Priority</Typography>
                <Box>
                  <Chip 
                    label={selectedCase.priority} 
                    size="small"
                    color={getPriorityColor(selectedCase.priority) as any}
                    sx={{ borderRadius: 4, fontWeight: 500 }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption"  sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>Status</Typography>
                <Box>
                  <Chip 
                    label={selectedCase.assignmentStatus} 
                    size="small"
                    color={getStatusColor(selectedCase.assignmentStatus) as any}
                    sx={{ borderRadius: 4, fontWeight: 500 }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

        
        <WorkbenchComponent
          workbenchSection={workbenchSection}
          handleWorkbenchSectionClick={handleWorkbenchSectionClick}
          diabetesIcdCodes={applicantData.medical.diabetesIcdCodes || []}
          sleepApneaIcdCodes={applicantData.medical.sleepApneaIcdCodes || []}
          handleSourceClick={handleSourceClick}
          isReferred={false}
          referralReason={''}
          extractedData={applicantData.medical.patientInfo.extractedData || {}}
          alitheiaEHRAssessments={applicantData.application.workbench.alitheiaEHRAssessments || []}
          carrierRuleDecisions={applicantData.application.workbench.risks.carrierRuleDecisions || []}
          alitheiaAssessments={applicantData.application.workbench.risks.alitheiaAssessments || []}
          summarizerComponentProps={applicantData.medical.ehrSummarizer}
        />
      </Box>
    );
  }

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
              Workbench
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                startIcon={<Refresh />} 
                variant="outlined"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(85, 105, 255, 0.2)'
                }}
              >
                Refresh
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px' }} >
            <TextField
              placeholder="Search by ID, policy, or work type..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ maxWidth: 500}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <Chip 
                label={`${cases.length} Total Cases`} 
                variant="outlined" 
                size="small"
                sx={{ borderRadius: 16 }}
                
              />
            </Box>
          </Box>
          
          {filteredCases.length === 0 ? (
            <Alert severity="info">
              No cases match your search criteria. Try adjusting your filters.
            </Alert>
          ) : (
            <>
              {isLoading && <LinearProgress />}
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eaedf3' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Policy Num</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Task ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Queue</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Work Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Next Action</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Received Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCases.map((caseData) => (
                      <TableRow key={caseData.taskId} sx={{ 
                        '&:hover': { backgroundColor: '#f5f9ff' }
                      }}>
                        <TableCell>{caseData.policyNum}</TableCell>
                        <TableCell>{caseData.taskId}</TableCell>
                        <TableCell>{caseData.queue}</TableCell>
                        <TableCell>{caseData.workType}</TableCell>
                        <TableCell>{caseData.nextAction}</TableCell>
                        <TableCell>{caseData.receivedDate}</TableCell>
                        <TableCell>{caseData.dueDate}</TableCell>
                        <TableCell>
                          <Chip 
                          label={caseData.priority} 
                          size="small"
                          color={getPriorityColor(caseData.priority) as any}
                          sx={{ borderRadius: 4, fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={caseData.assignmentStatus} 
                            size="small"
                            color={getStatusColor(caseData.assignmentStatus) as any}
                            sx={{ borderRadius: 4, fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                            <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => handleCaseClick(caseData)}
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                            Select
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WorkbenchPage;