import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid } from '@mui/material';

interface SummarizerComponentProps {
  summarizerComponentProps: {
    impairments: string;
    unprocessedDocuments: string;
    mostRecentBMI: number;
    avgBP: string;
    smokerStatus: string;
    buildTableData: Array<{
      date: string;
      build: string;
      bmi: number;
      class: string;
    }>;
    bloodPressureTableData: Array<{
      date: string;
      systolic: number;
      diastolic: number;
      flag: string;
    }>;
    coreLabResultsTableData: Array<{
      date: string;
      feature: string;
      value: number | string;
      unit: string;
      range: string;
      flag: string;
      code: string;
    }>;
  };
}

const SummarizerComponent: React.FC<SummarizerComponentProps> = ({ summarizerComponentProps }) => {
  const {
    impairments,
    unprocessedDocuments,
    mostRecentBMI,
    avgBP,
    smokerStatus,
    buildTableData,
    bloodPressureTableData,
    coreLabResultsTableData,
  } = summarizerComponentProps;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Summarizer
      </Typography>
      <ButtonBar summarizerComponentProps={summarizerComponentProps} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Build Table
          </Typography>
          <BuildTable data={buildTableData} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" gutterBottom>
            Blood Pressure Table
          </Typography>
          <BloodPressureTable data={bloodPressureTableData} />
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Core Lab Results Overview
      </Typography>
      <CoreLabResultsTable data={coreLabResultsTableData} />
    </Box>
  );
};

const ButtonBar: React.FC<{ summarizerComponentProps: SummarizerComponentProps['summarizerComponentProps'] }> = ({ summarizerComponentProps }) => {
  const { impairments, unprocessedDocuments, mostRecentBMI, avgBP, smokerStatus } = summarizerComponentProps;

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item>
        <Button variant="contained" sx={{ backgroundColor: 'yellow', color: 'black', textAlign: 'left' }}>
          <Typography variant="body1">{impairments}</Typography>
          <Typography variant="caption">Flagged</Typography>
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" sx={{ backgroundColor: 'yellow', color: 'black', textAlign: 'left' }}>
          <Typography variant="body1">{unprocessedDocuments}</Typography>
          <Typography variant="caption">Flagged</Typography>
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" sx={{ backgroundColor: 'teal', color: 'white', textAlign: 'left' }}>
          <Typography variant="body1">{mostRecentBMI}</Typography>
          <Typography variant="caption">Most Recent BMI</Typography>
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" sx={{ backgroundColor: 'darkgrey', color: 'white', textAlign: 'left' }}>
          <Typography variant="body1">{avgBP}</Typography>
          <Typography variant="caption">Avg BP last year</Typography>
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" sx={{ backgroundColor: 'grey', color: 'white', textAlign: 'left' }}>
          <Typography variant="body1">{smokerStatus}</Typography>
          <Typography variant="caption">Smoker Status</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

const BuildTable: React.FC<{ data: Array<{ date: string; build: string; bmi: number; class: string }> }> = ({ data }) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 300 }} aria-label="build table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Date</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Build (ft.in.lbs)</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>BMI</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Class</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.build}</TableCell>
            <TableCell>{row.bmi}</TableCell>
            <TableCell>{row.class}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const BloodPressureTable: React.FC<{ data: Array<{ date: string; systolic: number; diastolic: number; flag: string }> }> = ({ data }) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 300 }} aria-label="blood pressure table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Date</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Systolic</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Diastolic</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Flag</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.systolic}</TableCell>
            <TableCell>{row.diastolic}</TableCell>
            <TableCell>{row.flag}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const CoreLabResultsTable: React.FC<{ data: Array<{ date: string; feature: string; value: number | string; unit: string; range: string; flag: string; code: string }> }> = ({ data }) => (
  <TableContainer component={Paper} sx={{ mt: 4 }}>
    <Table sx={{ minWidth: 650 }} aria-label="core lab results table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Date</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Feature</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Value</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Unit</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Range</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Flag</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Code</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.feature}</TableCell>
            <TableCell>{row.value}</TableCell>
            <TableCell>{row.unit}</TableCell>
            <TableCell>{row.range}</TableCell>
            <TableCell>{row.flag}</TableCell>
            <TableCell>{row.code}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default SummarizerComponent;