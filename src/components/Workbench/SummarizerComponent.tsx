import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Card, CardContent, Chip, Divider,
  Tabs, Tab, Tooltip, IconButton, Avatar, Grid, Badge, Alert,
  LinearProgress, Button
} from '@mui/material';
import { 
  FavoriteBorder, ShowChart, LocalHospital, TrendingUp, TrendingDown, 
  Warning, CheckCircle, Info, DirectionsRun, AccessTime, Flag, 
  Error, Timeline
} from '@mui/icons-material';
import './css/SummarizerComponent.css';
import { selectSelectedCase } from '@/store/selectors';

const SummarizerComponent: React.FC = () => {
  // Get data directly from Redux state
  const selectedCase = useSelector(selectSelectedCase);
  // Ensure we have case data
  if (!selectedCase) {
    return null;
  }

  const {
    impairments = '',
    unprocessedDocuments = '',
    mostRecentBMI = 0,
    avgBP = '',
    smokerStatus = '',
    buildTableData = [],
    bloodPressureTableData = [],
    coreLabResultsTableData = []
  } = {
    impairments: selectedCase.health.ehrSummary?.impairments,
    unprocessedDocuments: selectedCase.health.ehrSummary?.unprocessedDocuments,
    mostRecentBMI: selectedCase.person.physical?.bmi,
    avgBP: selectedCase.health.vitals?.bloodPressure?.average,
    smokerStatus: selectedCase.health.smokerStatus,
    buildTableData: selectedCase.person.physical?.buildHistory,
    bloodPressureTableData: selectedCase.health.vitals?.bloodPressure?.history,
    coreLabResultsTableData: selectedCase.health.labs
  };

  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setIsLoading(true);
    setActiveTab(newValue);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const getBMIColor = (bmi: number) => {
    if (bmi >= 30) return '#f44336'; // Obese
    if (bmi >= 25) return '#ff9800'; // Overweight
    if (bmi >= 18.5) return '#4caf50'; // Normal
    return '#ff9800'; // Underweight
  };

  const getBMIClass = (bmi: number) => {
    if (bmi >= 30) return 'avatar-red';
    if (bmi >= 25) return 'avatar-warning';
    return 'avatar-green';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Card className="summarizer-card" elevation={0}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box className="summarizer-header">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar className="avatar-blue" sx={{ width: 42, height: 42, mr: 1.5 }}>
                  <LocalHospital />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a3353' }}>
                    Applicant EHR Summary
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automated EHR analysis and summarization
                  </Typography>
                </Box>
              </Box>
              
              <Chip 
                icon={<Info sx={{ fontSize: 16 }} />}
                label="EHR Summarizer" 
                variant="outlined"
                color="primary"
                className="status-chip"
              />
            </Box>
          </Box>

          {/* Patient Metrics Dashboard */}
          <Box className="summarizer-content">
            <Grid container spacing={2}>
              {/* Impairments */}
              <Grid item xs={12} sm={6} lg={3}>
                <Paper elevation={0} className="metric-card warning">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Badge 
                      badgeContent={impairments.split(',').length}
                      color="warning"
                      sx={{ mr: 1.5 }}
                    >
                      <Flag sx={{ color: '#ffc107', fontSize: 28 }} />
                    </Badge>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Flagged Impairments
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {impairments}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* BMI */}
              <Grid item xs={6} sm={6} lg={3}>
                <Paper elevation={0} className="metric-card">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar className={getBMIClass(mostRecentBMI)} sx={{ width: 36, height: 36, mr: 1.5 }}>
                      <DirectionsRun fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Most Recent BMI
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {mostRecentBMI}
                        </Typography>
                        {mostRecentBMI >= 30 && (
                          <Tooltip title="BMI indicates obesity">
                            <Warning className="bmi-warning-high" />
                          </Tooltip>
                        )}
                        {mostRecentBMI >= 25 && mostRecentBMI < 30 && (
                          <Tooltip title="BMI indicates overweight">
                            <Warning className="bmi-warning-medium" />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Blood Pressure */}
              <Grid item xs={6} sm={6} lg={3}>
                <Paper elevation={0} className="metric-card">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar className="avatar-red" sx={{ width: 36, height: 36, mr: 1.5 }}>
                      <FavoriteBorder fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Avg BP last year
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {avgBP}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Smoker Status */}
              <Grid item xs={12} sm={6} lg={3}>
                <Paper 
                  elevation={0} 
                  className={`metric-card ${smokerStatus.toLowerCase() === 'never' ? 'success' : 'error'}`}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      className={smokerStatus.toLowerCase() === 'never' ? 'avatar-green' : 'avatar-red'}
                      sx={{ width: 36, height: 36, mr: 1.5 }}
                    >
                      {smokerStatus.toLowerCase() === 'never' ? <CheckCircle fontSize="small" /> : <Error fontSize="small" />}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Smoker Status
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {smokerStatus}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Navigation Tabs */}
            <Box className="tabs-container">
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                className="custom-tabs"
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab 
                  label="Summary" 
                  icon={<Timeline sx={{ fontSize: 18 }} />} 
                  iconPosition="start" 
                />
                <Tab 
                  label="All Lab Results" 
                  icon={<ShowChart sx={{ fontSize: 18 }} />} 
                  iconPosition="start" 
                />
              </Tabs>
              
              {isLoading ? (
                <Box className="skeleton-container">
                  <LinearProgress sx={{ borderRadius: 1 }} />
                  <Box sx={{ mt: 4 }}>
                    <Grid container spacing={2}>
                      {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} md={6} key={item}>
                          <Paper className="skeleton-card" />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              ) : (
                <>
                  {activeTab === 0 && (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                      <BuildTable data={buildTableData} />
                      </Grid>
                      <Grid item xs={6}>
                      <BloodPressureTable data={bloodPressureTableData} />
                      </Grid>
                      <Grid item xs={12}>
                      <CoreLabResultsTable data={coreLabResultsTableData} />
                      </Grid>
                    </Grid>
                  )}
                  
                  {activeTab === 1 && (
                    <Box>
                      <AllLabResultsTable data={coreLabResultsTableData} />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

// Update the BuildTable component

const BuildTable: React.FC<{ data: Array<{ date: string; height: string; weight: string; bmi: number; build: string }> }> = ({ data }) => {
  return (
    <div className="enhanced-table-container compact-table">
      <div className="table-title">
        <DirectionsRun fontSize="small" className="table-icon table-icon-green" />
        <span>Build Measurements</span>
        <div className="table-actions">
          <Chip 
            label={`${data.length} Records`}
            size="small"
            variant="outlined"
            className="table-count-chip"
          />
        </div>
      </div>
      
      <TableContainer component={Paper} className="table-wrapper">
        <Table size="small" aria-label="build table">
          <TableHead>
            <TableRow>
              <TableCell className="table-header date-cell">Date</TableCell>
              <TableCell className="table-header value-cell">ft.in.lbs</TableCell>
              <TableCell className="table-header value-cell">BMI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const bmiHigh = row.class == "Obese"
              const bmiWarning = row.class == "Overweight";
              
              return (
                <TableRow key={index} className="table-row">
                  <TableCell className="date-cell">{row.date}</TableCell>
                  <TableCell className="value-cell">
                    <Typography variant="body2">
                      {row.build}
                    </Typography>
                  </TableCell>
                  <TableCell className="value-cell">
                    <Box className="value-with-indicator">
                      <Typography 
                        variant="body2" 
                        className={
                          bmiHigh ? 'value-alert' : 
                          bmiWarning ? 'value-warning' : 'value-normal'
                        }
                      >
                        {row.bmi}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <div className="table-footer">
        <Typography variant="caption" color="text.secondary">
          <span className="bp-legend-item">
            <span className="bp-legend-dot normal"></span> Normal
          </span>
          <span className="bp-legend-item">
            <span className="bp-legend-dot elevated"></span> Overweight
          </span>
          <span className="bp-legend-item">
            <span className="bp-legend-dot high"></span> Obese
          </span>
        </Typography>
      </div>
    </div>
  );
};

// Update the BloodPressureTable component
const BloodPressureTable: React.FC<{ data: Array<{ date: string; systolic: number; diastolic: number; heartRate: number }> }> = ({ data }) => {
  return (
    <div className="enhanced-table-container compact-table">
      <div className="table-title">
        <FavoriteBorder fontSize="small" className="table-icon table-icon-red" />
        <span>Blood Pressure</span>
        <div className="table-actions">
          <Chip 
            label={`${data.length} Records`}
            size="small"
            variant="outlined"
            className="table-count-chip"
          />
        </div>
      </div>
      
      <TableContainer component={Paper} className="table-wrapper">
        <Table size="small" aria-label="blood pressure table">
          <TableHead>
            <TableRow>
              <TableCell className="table-header date-cell">Date</TableCell>
              <TableCell className="table-header value-cell">Systolic</TableCell>
              <TableCell className="table-header value-cell">Diastolic</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const isHigh = (row.flag == "Hypertension");
              const isElevated = (row.flag == "Elevated");
              
              return (
                <TableRow key={index} className="table-row">
                  <TableCell className="date-cell">{row.date}</TableCell>
                  <TableCell className="value-cell">
                    <Typography 
                      variant="body2" 
                      className={isHigh ? 'value-alert' : isElevated ? 'value-warning' : 'value-normal'}
                    >
                      {row.systolic}
                    </Typography>
                  </TableCell>
                  <TableCell className="value-cell">
                    <Typography 
                      variant="body2" 
                      className={isHigh ? 'value-alert' : isElevated ? 'value-warning' : 'value-normal'}
                    >
                      {row.diastolic}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <div className="table-footer">
        <Typography variant="caption" color="text.secondary">
          <span className="bp-legend-item">
            <span className="bp-legend-dot normal"></span> Normal
          </span>
          <span className="bp-legend-item">
            <span className="bp-legend-dot elevated"></span> Elevated
          </span>
          <span className="bp-legend-item">
            <span className="bp-legend-dot high"></span> Hypertension
          </span>
        </Typography>
      </div>
    </div>
  );
};

const CoreLabResultsTable: React.FC<{ data: Array<{ date: string; feature: string; value: number | string; unit: string; range: string; flag: string; code: string }> }> = ({ data }) => {
  // Group data by feature
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.feature]) {
      acc[item.feature] = [];
    }
    acc[item.feature].push(item);
    return acc;
  }, {} as Record<string, typeof data>);

  const features = Object.keys(groupedData);
  
  return (
    <div className="enhanced-table-container core-lab-container">
      <div className="table-title">
        <ShowChart fontSize="small" className="table-icon table-icon-green" />
        <span>Core Lab Results</span>
        <div className="table-actions">
          <Chip 
            label={`${data.length} Records`}
            size="small"
            variant="outlined"
            className="table-count-chip"
          />
        </div>
      </div>
      
      <div className="lab-results-grid">
        {features.map(feature => {
          const featureData = groupedData[feature];
          const latestResult = featureData[0]; // Assuming sorted by date
          const isAbnormal = latestResult.flag.toLowerCase() !== 'normal';
          
          return (
            <Paper key={feature} className={`lab-result-card ${isAbnormal ? 'lab-result-card-alert' : ''}`}>
              <div className="lab-result-header">
                <Typography variant="subtitle2">{feature}</Typography>
                <Chip 
                  label={latestResult.flag} 
                  size="small" 
                  className={
                    latestResult.flag.toLowerCase() === 'high' ? 'status-chip status-chip-high' : 
                    latestResult.flag.toLowerCase() === 'low' ? 'status-chip status-chip-medium' : 
                    'status-chip status-chip-normal'
                  }
                />
              </div>
              <div className="lab-result-value">
                <Typography 
                  variant="h5" 
                  className={
                    latestResult.flag.toLowerCase() === 'high' ? 'value-alert' : 
                    latestResult.flag.toLowerCase() === 'low' ? 'value-warning' : ''
                  }
                >
                  {latestResult.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {latestResult.unit}
                </Typography>
                
                {latestResult.flag.toLowerCase() === 'high' && (
                  <TrendingUp className="trend-icon trend-icon-up" />
                )}
                {latestResult.flag.toLowerCase() === 'low' && (
                  <TrendingDown className="trend-icon trend-icon-down" />
                )}
              </div>
              <div className="lab-result-meta">
                <Typography variant="caption" color="text.secondary">
                  Normal range: {latestResult.range}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Latest: {latestResult.date}
                </Typography>
              </div>
              {featureData.length > 1 && (
                <div className="lab-result-history">
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    History
                  </Typography>
                  <div className="history-chart">
                    {featureData.map((item, idx) => (
                      <Tooltip 
                        key={idx}
                        title={`${item.date}: ${item.value} ${item.unit}`}
                        arrow
                      >
                        <div 
                          className={`history-point ${
                            item.flag.toLowerCase() === 'high' ? 'history-point-high' : 
                            item.flag.toLowerCase() === 'low' ? 'history-point-low' : 
                            'history-point-normal'
                          }`}
                        ></div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}
            </Paper>
          );
        })}
      </div>
    </div>
  );
};

const AllLabResultsTable: React.FC<{ data: Array<{ date: string; feature: string; value: number | string; unit: string; range: string; flag: string; code: string }> }> = ({ data }) => {
  return (
    <div className="enhanced-table-container table-container">
      <div className="table-title">
        <ShowChart fontSize="small" className="table-icon table-icon-green" />
        <span>All Lab Results</span>
        <div className="table-actions">
          <Chip 
            label={`${data.length} Records`}
            size="small"
            variant="outlined"
            className="table-count-chip"
          />
        </div>
      </div>
      
      <TableContainer component={Paper} className="table-wrapper">
        <Table size="small" aria-label="all lab results table">
          <TableHead>
            <TableRow>
              <TableCell className="table-header">Date</TableCell>
              <TableCell className="table-header">Test</TableCell>
              <TableCell className="table-header">Result</TableCell>
              <TableCell className="table-header">Unit</TableCell>
              <TableCell className="table-header">Normal Range</TableCell>
              <TableCell className="table-header">Status</TableCell>
              <TableCell className="table-header">Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const isAbnormal = row.flag.toLowerCase() !== 'normal';
              
              return (
                <TableRow 
                  key={index} 
                  className={`table-row ${
                    row.flag.toLowerCase() === 'high' ? 'row-alert' : 
                    row.flag.toLowerCase() === 'low' ? 'row-warning' : ''
                  }`}
                >
                  <TableCell className="date-cell">{row.date}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.feature}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box className="value-with-indicator">
                      <Typography 
                        variant="body2" 
                        className={
                          row.flag.toLowerCase() === 'high' ? 'value-alert' : 
                          row.flag.toLowerCase() === 'low' ? 'value-warning' : ''
                        }
                        sx={{ fontWeight: isAbnormal ? 600 : 400 }}
                      >
                        {row.value}
                      </Typography>
                      
                      {row.flag.toLowerCase() === 'high' && (
                        <TrendingUp sx={{ fontSize: 16, ml: 0.5 }} className="trend-icon-up" />
                      )}
                      {row.flag.toLowerCase() === 'low' && (
                        <TrendingDown sx={{ fontSize: 16, ml: 0.5 }} className="trend-icon-down" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.range}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.flag} 
                      size="small" 
                      className={
                        row.flag.toLowerCase() === 'high' ? 'status-chip status-chip-high' : 
                        row.flag.toLowerCase() === 'low' ? 'status-chip status-chip-medium' : 
                        'status-chip status-chip-normal'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`Medical code: ${row.code}`}>
                      <Chip
                        label={row.code}
                        size="small"
                        variant="outlined"
                        className="status-chip"
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <div className="table-footer">
        <Typography variant="caption" color="text.secondary">
          <span className="bp-legend-item">
            <span className="bp-legend-dot normal"></span> Normal
          </span>
          <span className="bp-legend-item">
            <span className="bp-legend-dot elevated"></span> Low
          </span>
          <span className="bp-legend-item">
            <span className="bp-legend-dot high"></span> High
          </span>
        </Typography>
      </div>
    </div>
  );
};

export default SummarizerComponent;