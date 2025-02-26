import React from 'react';
import { Button } from '@mui/material';
import { AssessmentResult } from "@/components/AssessmentResult";

const AssessmentComponent = ({ isReferred, extractedData, handleSourceClick, handleStepChange }) => {
  return (
    <div>
      <AssessmentResult
        riskClass={isReferred ? "Referred" : "Standard"}
        extractedData={extractedData}
        onSourceClick={handleSourceClick}
        isReferred={isReferred}
        referralReason="Missing AHI Score data in EHR"
      />
      <div className="flex justify-start mt-6">
        <Button variant="outline" onClick={() => handleStepChange(2)}>
          ← Back to Rules Analysis
        </Button>
      </div>
    </div>
  );
};

export default AssessmentComponent;