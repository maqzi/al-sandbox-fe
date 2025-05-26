import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CircleNode = ({ data }) => {
  return (
    <div style={{ borderRadius: '50%', background: '#fff', border: '1px solid #222', padding: 10, textAlign: 'center' }}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{ background: '#555' }}
      />
      <div>{data.label}</div>
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default memo(CircleNode);