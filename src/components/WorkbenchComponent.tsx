import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import EHRsComponent from "@/components/EHRsComponent";
import { AssessmentResult } from '@/components/AssessmentResult';

const WorkbenchComponent = ({ workbenchSection, handleWorkbenchSectionClick, diabetesIcdCodes, sleepApneaIcdCodes, handleSourceClick, isReferred, extractedData, referralReason }) => {
  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-100">
        <List>
          <ListItem button={true} onClick={() => handleWorkbenchSectionClick('EHRs')}>
            <ListItemText primary="EHRs" />
          </ListItem>
          <ListItem button={true} onClick={() => handleWorkbenchSectionClick('Risks')}>
            <ListItemText primary="Risks" />
          </ListItem>
        </List>
      </div>
      <div className="w-3/4 p-4">
        {workbenchSection === 'Risks' && (
          <div>
            <AssessmentResult
              riskClass={isReferred ? "Referred" : "Standard"}
              extractedData={extractedData}
              onSourceClick={handleSourceClick}
              isReferred={isReferred}
              referralReason={referralReason}
            />
          </div>
        )}
        {workbenchSection === 'EHRs' && (
          <div>
            <EHRsComponent
              diabetesIcdCodes={diabetesIcdCodes}
              sleepApneaIcdCodes={sleepApneaIcdCodes}
              handleSourceClick={handleSourceClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkbenchComponent;