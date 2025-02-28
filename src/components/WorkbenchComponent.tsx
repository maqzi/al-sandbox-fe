import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import EHRsComponent from "@/components/EHRsComponent";
import { AssessmentResult } from '@/components/AssessmentResult';
import EHRsAssessmentComponent from '@/components/EHRsAssessmentComponent';
import RisksComponent from '@/components/RisksComponent';

const LockIcon = () => (
  <img src="/lock.svg" alt="Lock Icon" style={{ width: 24, height: 24 }} />
);

const WorkbenchComponent = ({ workbenchSection, 
    handleWorkbenchSectionClick, 
    diabetesIcdCodes, 
    sleepApneaIcdCodes, 
    handleSourceClick, 
    isReferred,
    extractedData,
    referralReason,
    alitheiaEHRAssessments,
    carrierRuleDecisions,
    alitheiaAssessments,
    summarizerComponentProps }) => {
  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-100">
        <List>
          <ListItem button={false} style={{ opacity: 0.5 }}>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Case Details" />
          </ListItem>
          <ListItem button={false} style={{ opacity: 0.5 }}>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Rx/Dx" />
          </ListItem>
          <ListItem button={false} style={{ opacity: 0.5 }}>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="MIB" />
          </ListItem>
          <ListItem button={true} onClick={() => handleWorkbenchSectionClick('EHRs')}>
            <ListItemText primary="EHRs" />
          </ListItem>
          <ListItem button={true} onClick={() => handleWorkbenchSectionClick('Risks')}>
            <ListItemText primary="Risks" />
          </ListItem>
          <ListItem button={false} style={{ opacity: 0.5 }}>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Amendments" />
          </ListItem>
          <ListItem button={true} onClick={() => handleWorkbenchSectionClick('Ideas')}>
            <ListItemText primary="Ideas" />
          </ListItem>
        </List>
      </div>
      <div className="w-3/4 p-4">
        {workbenchSection === 'Risks' && (
          <div>
            <RisksComponent
              carrierRuleDecisions={carrierRuleDecisions}
              alitheiaAssessments={alitheiaAssessments}
            />
          </div> 
        )}
        {workbenchSection === 'EHRs' && (
          <div>
            <EHRsAssessmentComponent 
              assessments={alitheiaEHRAssessments}
              summarizerComponentProps={summarizerComponentProps}
            />
          </div>
        )}
        {workbenchSection === 'Ideas' && (
          <div>
            Other Stuff
            <EHRsComponent
              diabetesIcdCodes={diabetesIcdCodes}
              sleepApneaIcdCodes={sleepApneaIcdCodes}
              handleSourceClick={handleSourceClick}
            />
            <AssessmentResult
              riskClass={isReferred ? "Referred" : "Standard"}
              extractedData={extractedData}
              onSourceClick={handleSourceClick}
              isReferred={isReferred}
              referralReason={referralReason}
            />
          </div> 
        )}
      </div>
    </div>
  );
};

export default WorkbenchComponent;