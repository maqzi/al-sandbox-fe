import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AssessmentResult } from "@/components/AssessmentResult";
import { selectSelectedCase } from '@/store/selectors';

const AssessmentComponent = () => {
  const dispatch = useDispatch();
  const selectedCase = useSelector(selectSelectedCase);

  // Return early if no case is selected
  if (!selectedCase) {
    return null;
  }

  // Get assessment data from the Redux state
  const ehrAssessments = selectedCase.assessment?.ehrAssessments || [];
  // const firstAssessment = ehrAssessments[0] || {};
  
  // Extract required data
  // const isReferred = firstAssessment.referFlag || false;
  // const referralReason = firstAssessment.referralReason || "No referral reason provided";
  // const riskClass = firstAssessment.bestRiskClass || "Standard";
  // const extractedData = selectedCase.health?.criticalValues || [];
   
  return (
    <AssessmentResult
      riskClass="ASD"
      extractedData="{extractedData}"
      onSourceClick="{handleSourceClick}"
      isReferred="{isReferred}"
      referralReason="{referralReason}"
    />
      // <AssessmentResult
      //   riskClass={isReferred ? "Referred" : riskClass}
      //   extractedData={extractedData}
      //   onSourceClick={handleSourceClick}
      //   isReferred={isReferred}
      //   referralReason={referralReason}
      // />
    );
};

export default AssessmentComponent;