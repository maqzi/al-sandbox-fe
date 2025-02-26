import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const DiamondNode = ({ data }) => {
  return (
    <div style={{ width: 100, height: 100, background: '#fff', border: '1px solid #222', transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Handle type="target" position={Position.Top} style={{ borderRadius: 0, transform: 'rotate(-45deg)' }} />
      <div style={{ transform: 'rotate(-45deg)' }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} style={{ borderRadius: 0, transform: 'rotate(-45deg)' }} />
    </div>
  );
};

export default DiamondNode;