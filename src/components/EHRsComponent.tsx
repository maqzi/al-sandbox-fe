import React from 'react';
import { IcdCodeCard } from '@/components/IcdCodeCard';

const EHRsComponent = ({ diabetesIcdCodes, sleepApneaIcdCodes, handleSourceClick, handleStepChange }) => {
  return (
    <div>
      <IcdCodeCard
        title="Type 2 Diabetes ICD-10 Codes"
        codes={diabetesIcdCodes}
        onSourceClick={handleSourceClick}
      />
      <IcdCodeCard
        title="Sleep Apnea ICD-10 Codes"
        codes={sleepApneaIcdCodes}
        onSourceClick={handleSourceClick}
      />
    </div>
  );
};

export default EHRsComponent;