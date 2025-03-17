import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Box, Typography } from '@mui/material';
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
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-top"
      />
      <div className="diamond-shape">
        <Typography variant="body2" className="diamond-label">
          {data.label}
        </Typography>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-bottom"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-right"
      />
      <Handle
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
        className="diamond-handle diamond-handle-left"
      />
    </div>
  );
};

export default memo(DiamondNode);