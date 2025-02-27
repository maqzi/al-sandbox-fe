import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface RisksComponentProps {
  carrierRuleDecisions: Array<{
    rule: string;
    riskClass: string;
    mortalityRating: number;
    refer: string;
    decline: string;
    tobacco: string;
    flatExtraRating: number;
  }>;
  alitheiaAssessments: Array<{
    rule: string;
    riskClass: string;
    mortalityRating: number;
    refer: string;
    decline: string;
    tobacco: string;
    flatExtraRating: number;
    targetOrder: number;
    overrideReason: string;
    overrideComment: string;
  }>;
}

const RisksComponent: React.FC<RisksComponentProps> = ({ carrierRuleDecisions, alitheiaAssessments }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Carrier Rule Decisions
      </Typography>
      <CarrierRuleDecisionsTable data={carrierRuleDecisions} />
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        alitheia Assessments
      </Typography>
      <AlitheiaAssessmentsTable data={alitheiaAssessments} />
    </Box>
  );
};

interface TableProps {
  data: Array<{
    rule: string;
    riskClass: string;
    mortalityRating: number;
    refer: string;
    decline: string;
    tobacco: string;
    flatExtraRating: number;
    targetOrder?: number;
    overrideReason?: string;
    overrideComment?: string;
  }>;
}

const CarrierRuleDecisionsTable: React.FC<TableProps> = ({ data }) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="carrier rule decisions table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Rule</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Risk Class</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Mortality Rating</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Refer</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Decline</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Tobacco</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Flat Extra Rating</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.rule}</TableCell>
            <TableCell>{row.riskClass}</TableCell>
            <TableCell>{row.mortalityRating}</TableCell>
            <TableCell>{row.refer}</TableCell>
            <TableCell>{row.decline}</TableCell>
            <TableCell>{row.tobacco}</TableCell>
            <TableCell>{row.flatExtraRating}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const AlitheiaAssessmentsTable: React.FC<TableProps> = ({ data }) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="alitheia assessments table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Rule</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Risk Class</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Mortality Rating</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Refer</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Decline</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Tobacco</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Flat Extra Rating</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Target Order</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Override Reason</TableCell>
          <TableCell sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Override Comment</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.rule}</TableCell>
            <TableCell>{row.riskClass}</TableCell>
            <TableCell>{row.mortalityRating}</TableCell>
            <TableCell>{row.refer}</TableCell>
            <TableCell>{row.decline}</TableCell>
            <TableCell>{row.tobacco}</TableCell>
            <TableCell>{row.flatExtraRating}</TableCell>
            <TableCell>{row.targetOrder}</TableCell>
            <TableCell>{row.overrideReason}</TableCell>
            <TableCell>{row.overrideComment}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default RisksComponent;