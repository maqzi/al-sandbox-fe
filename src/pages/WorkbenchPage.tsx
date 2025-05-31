import {
  Search,
  Refresh,
  CalendarToday,
  Schedule,
  ArrowBack,
} from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  TableContainer,
  Divider,
  TextField,
  InputAdornment,
  Alert,
  LinearProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import WorkbenchComponent from '@/components/Workbench/WorkbenchComponent';
import datadog from '@/lib/datadog';
import { selectAllCases, selectSelectedCase } from '@/store/selectors';
import { setSelectedCase } from '@/store/workbenchSlice';

// Define interface for filtered case data (displayed in the table)
interface CaseTableData {
  id: string;
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
  const dispatch = useDispatch();

  // Get data from our new workbench redux state
  const allCases = useSelector(selectAllCases);
  const selectedCaseData = useSelector(selectSelectedCase);

  // Transform cases for table display format
  const tableCases = allCases.map(caseItem => ({
    id: caseItem.id,
    taskId: caseItem.case.taskId,
    policyNum: caseItem.case.policyNum,
    queue: caseItem.case.queue,
    workType: caseItem.case.workType,
    nextAction: caseItem.case.nextAction,
    receivedDate: caseItem.case.receivedDate,
    dueDate: caseItem.case.dueDate,
    priority: caseItem.case.priority,
    assignmentStatus: caseItem.case.assignmentStatus,
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Local component handlers
  const handleCaseClick = (caseData: CaseTableData) => {
    setIsLoading(true);
    datadog.trackInteraction('button', 'select_case', { caseId: caseData.id }); // Track case selection
    // Simulate loading delay, then update Redux store with selected case ID
    setTimeout(() => {
      dispatch(setSelectedCase(caseData.id));
      setIsLoading(false);
    }, 800);
  };

  const handleBackClick = () => {
    datadog.trackInteraction('button', 'back_to_cases'); // Track back button click
    dispatch(setSelectedCase(null));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    datadog.trackSearch(searchValue, 'case_search', filteredCases.length); // Track search input
  };

  const filteredCases = tableCases.filter(
    caseData =>
      caseData.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseData.policyNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseData.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseData.queue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'assigned':
        return 'success';
      case 'pending':
        return 'warning';
      case 'unassigned':
        return 'error';
      default:
        return 'default';
    }
  };

  // No need for getFullCaseData as we now use the selectedCaseData from Redux

  if (selectedCaseData) {
    // Transform selected case data to match the CaseTableData interface for display
    const displayCase = {
      id: selectedCaseData.id,
      taskId: selectedCaseData.case.taskId,
      policyNum: selectedCaseData.case.policyNum,
      queue: selectedCaseData.case.queue,
      workType: selectedCaseData.case.workType,
      nextAction: selectedCaseData.case.nextAction,
      receivedDate: selectedCaseData.case.receivedDate,
      dueDate: selectedCaseData.case.dueDate,
      priority: selectedCaseData.case.priority,
      assignmentStatus: selectedCaseData.case.assignmentStatus,
    };

    return (
      <Box
        sx={{ padding: '24px', backgroundColor: '#f8f9fc', minHeight: '100vh' }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackClick}
          sx={{
            marginBottom: '16px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Back to Cases
        </Button>
        <Paper
          sx={{ padding: '24px', borderRadius: '8px', marginBottom: '24px' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Case {displayCase.taskId}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                Policy: {displayCase.policyNum} • Queue: {displayCase.queue}
              </Typography>
            </Box>
            <Chip
              label={displayCase.workType}
              color="primary"
              sx={{ borderRadius: 4, fontWeight: 500 }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
              >
                Next Action
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}
              >
                {displayCase.nextAction}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
              >
                Received Date
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}
              >
                <CalendarToday sx={{ fontSize: 14, marginRight: 1 }} />
                {displayCase.receivedDate}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
              >
                Due Date
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}
              >
                <Schedule sx={{ fontSize: 14, marginRight: 1 }} />
                {displayCase.dueDate}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
              >
                Priority
              </Typography>
              <Box>
                <Chip
                  label={displayCase.priority}
                  size="small"
                  color={getPriorityColor(displayCase.priority) as any}
                  sx={{ borderRadius: 4, fontWeight: 500 }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
              >
                Status
              </Typography>
              <Box>
                <Chip
                  label={displayCase.assignmentStatus}
                  size="small"
                  color={getStatusColor(displayCase.assignmentStatus) as any}
                  sx={{ borderRadius: 4, fontWeight: 500 }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        <WorkbenchComponent />
      </Box>
    );
  }

  return (
    <Box
      className="p-4"
      sx={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}
    >
      <Card
        sx={{
          marginBottom: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
            }}
          >
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
                  boxShadow: '0 4px 12px rgba(85, 105, 255, 0.2)',
                }}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
              gap: '16px',
            }}
          >
            <TextField
              placeholder="Search by ID, policy, or work type..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ maxWidth: 500 }}
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
                label={`${tableCases.length} Total Cases`}
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
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  boxShadow: 'none',
                  border: '1px solid #eaedf3',
                }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Policy Num</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Task ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Queue</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Work Type</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Next Action
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Received Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCases.map(caseData => (
                      <TableRow
                        key={caseData.id}
                        sx={{
                          '&:hover': { backgroundColor: '#f5f9ff' },
                        }}
                      >
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
                            color={
                              getStatusColor(caseData.assignmentStatus) as any
                            }
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
