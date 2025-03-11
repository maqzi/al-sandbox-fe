import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Typography } from '@mui/material';
import { Layout } from '@/components/Layout';
import WorkbenchComponent from '@/components/WorkbenchComponent';

const WorkbenchPage = ({ cases, workbenchData, summarizerComponentProps, handleWorkbenchSectionClick, handleSourceClick, handleStepChange }) => {
  const [selectedCase, setSelectedCase] = useState(null);

  const handleCaseClick = (caseData) => {
    setSelectedCase(caseData);
  };

  if (selectedCase) {
    return (
      <WorkbenchComponent
        workbenchSection="EHRs"
        handleWorkbenchSectionClick={() => {}}
        diabetesIcdCodes={workbenchData.diabetesIcdCodes}
        sleepApneaIcdCodes={workbenchData.sleepApneaIcdCodes}
        handleSourceClick={() => {}}
        isReferred={workbenchData.isReferred}
        referralReason={workbenchData.referralReason}
        extractedData={workbenchData.extractedData}
        alitheiaEHRAssessments={workbenchData.alitheiaEHRAssessments}
        carrierRuleDecisions={workbenchData.carrierRuleDecisions}
        alitheiaAssessments={workbenchData.alitheiaAssessments}
        summarizerComponentProps={summarizerComponentProps}
      />
    );
  }

  return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Policy Num</TableCell>
            <TableCell>Task ID</TableCell>
            <TableCell>Queue</TableCell>
            <TableCell>Work Type</TableCell>
            <TableCell>Next Action</TableCell>
            <TableCell>Received Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Assignment Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.map((caseData) => (
            <TableRow key={caseData.taskId}>
              <TableCell>{caseData.policyNum}</TableCell>
              <TableCell>{caseData.taskId}</TableCell>
              <TableCell>{caseData.queue}</TableCell>
              <TableCell>{caseData.workType}</TableCell>
              <TableCell>{caseData.nextAction}</TableCell>
              <TableCell>{caseData.receivedDate}</TableCell>
              <TableCell>{caseData.dueDate}</TableCell>
              <TableCell>{caseData.priority}</TableCell>
              <TableCell>{caseData.assignmentStatus}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleCaseClick(caseData)}>
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
};

export default WorkbenchPage;