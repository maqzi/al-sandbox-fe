import React from 'react';
import { Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SummarizerComponent, { SummarizerComponentProps } from '@/components/Workbench/SummarizerComponent';

interface EHRsAssessment {
  rule: string;
  bestRiskClass: string;
  rating: number;
  flatExtras: string[];
  declineFlag: boolean;
  referFlag: boolean;
  inputsDataUsed: { inputs: string; dataUsed: string }[];
}

interface EHRsAssessmentComponentProps {
  assessments: EHRsAssessment[];
  summarizerComponentProps: SummarizerComponentProps['summarizerComponentProps'];
}

const EHRsAssessmentComponent: React.FC<EHRsAssessmentComponentProps> = ({ assessments, summarizerComponentProps }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="assessment tabs">
        <Tab label="Summarizer" />
        <Tab label="alitheia EHR" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <SummarizerComponent summarizerComponentProps={summarizerComponentProps} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TableContainer component={Paper}>
          <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '2px solid #000' }}>Rule</TableCell>
                <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '2px solid #000' }}>Best risk class</TableCell>
                <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '2px solid #000' }}>Rating</TableCell>
                <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '2px solid #000' }}>Flat extras</TableCell>
                <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '2px solid #000' }}>Decline Flag</TableCell>
                <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '2px solid #000' }}>Refer Flag</TableCell>
                <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', borderBottom: '2px solid #000' }}>Inputs & Data Used</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessments.map((assessment, index) => (
                <TableRow key={index}>
                  <TableCell>{assessment.rule}</TableCell>
                  <TableCell>{assessment.bestRiskClass}</TableCell>
                  <TableCell>{assessment.rating}</TableCell>
                  <TableCell>{JSON.stringify(assessment.flatExtras)}</TableCell>
                  <TableCell>{assessment.declineFlag.toString()}</TableCell>
                  <TableCell>{assessment.referFlag.toString()}</TableCell>
                  <TableCell>
                    <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '0 5px' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ backgroundColor: '#e0e0e0', fontWeight: 'bold', borderBottom: '1px solid #000' }}>Inputs</TableCell>
                          <TableCell sx={{ backgroundColor: '#e0e0e0', fontWeight: 'bold', borderBottom: '1px solid #000' }}>Data Used</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assessment.inputsDataUsed.map((inputData, inputIndex) => (
                          <TableRow key={inputIndex}>
                            <TableCell>{inputData.inputs}</TableCell>
                            <TableCell>{inputData.dataUsed}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default EHRsAssessmentComponent;