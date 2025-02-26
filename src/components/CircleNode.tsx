import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

const CircleNode = ({ data }) => {
  return (
    <div style={{ borderRadius: '50%', background: '#fff', border: '1px solid #222', padding: 10, textAlign: 'center' }}>
      <Handle type="target" position={Position.Top} style={{ borderRadius: 0 }} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} style={{ borderRadius: 0 }} />
    </div>
  );
};

export default CircleNode;