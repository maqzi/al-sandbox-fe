import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const DiamondNode = ({ data }) => {
  return (
    <div style={{ width: 150, height: 150, background: '#fff', border: '1px solid #222', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Handle type="target" position={Position.Left} style={{ borderRadius: 0, transform: 'rotate(-45deg)' }} />
      <div style={{ transform: 'rotate(-45deg)' }}>{data.label}</div>
      <Handle type="source" position={Position.Right} style={{ borderRadius: 0, transform: 'rotate(-45deg)' }} />
    </div>
  );
};

export default DiamondNode;