import React from 'react';
import WhiteboardWrapper from '@/components/Whiteboard';

const RulesDesignerComponent = ({ handleStepChange, nodes, edges }) => {
  return (
    <div>
      <WhiteboardWrapper initialNodes={nodes} initialEdges={edges}/>
    </div>
  );
};

export default RulesDesignerComponent;