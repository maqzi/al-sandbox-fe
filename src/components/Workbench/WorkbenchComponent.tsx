import { Box } from '@mui/material';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectSelectedCase,
  selectCurrentWorkbenchSection,
} from '@/store/selectors';
import { setWorkbenchSection, setActiveSource } from '@/store/workbenchSlice';

import AssessmentsComponent from './AssessmentsComponent';
import CaseDetailsComponent from './CaseDetailsComponent';
import SummarizerComponent from './SummarizerComponent';
import WorkbenchSideMenu from './WorkbenchSideMenu';
import './css/WorkbenchComponent.css';

const WorkbenchComponent: React.FC = () => {
  const dispatch = useDispatch();

  // Get all data from Redux
  const selectedCase = useSelector(selectSelectedCase);
  const workbenchSection = useSelector(selectCurrentWorkbenchSection);

  // Ensure we have case data
  if (!selectedCase) {
    return null;
  }

  // Prepare side menu data
  const caseInfo = {
    id: selectedCase.id,
    name: selectedCase.person.fullName,
    age: selectedCase.person.age,
    date: selectedCase.policy.applicationDate,
    conditions: selectedCase.health.conditions.map(c => c.name),
  };

  // Action handlers
  const handleWorkbenchSectionClick = (section: string) => {
    dispatch(
      setWorkbenchSection({
        caseId: selectedCase.id,
        section,
      })
    );
  };

  const handleSourceClick = (source: string) => {
    dispatch(
      setActiveSource({
        caseId: selectedCase.id,
        source,
      })
    );
  };

  const isReferred =
    selectedCase.assessment.ehrAssessments?.[0]?.referFlag || false;
  const referralReason =
    selectedCase.assessment.ehrAssessments?.[0]?.referralReason || '';

  return (
    <div className="workbench-component">
      <Box display="flex" className="workbench-container">
        {/* Side Menu */}
        <WorkbenchSideMenu
          activeSection={workbenchSection}
          onSectionChange={handleWorkbenchSectionClick}
          caseInfo={caseInfo}
        />

        {/* Main Content */}
        <Box className="workbench-main-content">
          <div className="workbench-panel">
            {/* Case Details Section */}
            {workbenchSection === 'Case Details' && <CaseDetailsComponent />}

            {/* EHR Section */}
            {workbenchSection === 'EHRs' && (
              <>
                <SummarizerComponent />
                {/* Add other EHR section content here */}
              </>
            )}

            {/* Assessments Section */}
            {workbenchSection === 'Assessment' && <AssessmentsComponent />}

            {/* Add other workbench sections as needed */}
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default WorkbenchComponent;
