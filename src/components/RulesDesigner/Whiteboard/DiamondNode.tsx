import { Typography } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import React, { memo } from 'react';
import './css/DiamondNode.css';

interface DiamondNodeProps {
  data: {
    label: string;
  };
  isConnectable: boolean;
}

const DiamondNode: React.FC<DiamondNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className="diamond-node">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-top"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-left"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-right"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-bottom"
      />
      <div className="diamond-shape">
        <Typography variant="body2" className="diamond-label">
          {data.label}
        </Typography>
      </div>
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-top-source"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-left-source"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-right-source"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-bottom-source"
      />
    </div>
  );
};

export default memo(DiamondNode);
