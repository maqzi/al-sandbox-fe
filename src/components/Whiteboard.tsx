import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'react-flow-renderer';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CircleNode from './CircleNode';
import DiamondNode from './DiamondNode';

const nodeTypes = {
  circle: CircleNode,
  diamond: DiamondNode,
};

const Whiteboard = ({ initialNodes, initialEdges }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [lockedDialogOpen, setLockedDialogOpen] = React.useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeLabel, setEdgeLabel] = useState('');

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleLockedDialogOpen = () => {
    setLockedDialogOpen(true);
  };

  const handleLockedDialogClose = () => {
    setLockedDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEdge(null);
    setEdgeLabel('');
  };

  const handleEdgeClick = (event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
    setEdgeLabel(edge.label || '');
    setDialogOpen(true);
  };

  const handleLabelChange = (event) => {
    setEdgeLabel(event.target.value);
  };

  const handleLabelSubmit = () => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === selectedEdge.id ? { ...edge, label: edgeLabel } : edge
      )
    );
    handleDialogClose();
  };

  const addRectangle = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `Rectangle ${nodes.length + 1}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addCircle = (label) => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'circle',
      data: { label },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addDiamond = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'diamond',
      data: { label: `Decision ${nodes.length + 1}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const removeNode = () => {
    setNodes((nds) => nds.slice(0, -1));
  };
  return (
    <div style={{ height: 600, border: '1px solid black', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button variant="contained" color="primary" onClick={() => addCircle('Start')}>
          Start
        </Button>
        <Button variant="contained" color="primary" onClick={() => addCircle('End')}>
          End
        </Button>
        <Button variant="contained" color="primary" onClick={addDiamond}>
          Gateway
        </Button>
        <Button variant="contained" color="primary" onClick={addRectangle}>
          Calculation
        </Button>
        <Button variant="contained" color="error" onClick={removeNode}>
          Remove Last Node
        </Button>
      </div>
      <Button variant="contained" color="secondary" style={{ position: 'absolute', top: 10, right: 10, zIndex: 20 }} onClick={handleLockedDialogOpen}>
        Test Rule
      </Button>
      <Button variant="contained" color="secondary" style={{ position: 'absolute', top: 50, right: 10, zIndex: 20 }} onClick={handleLockedDialogOpen}>
        Rule AI
      </Button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={handleEdgeClick}
        fitView
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Update Edge Label</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Edge Label"
            type="text"
            fullWidth
            value={edgeLabel}
            onChange={handleLabelChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLabelSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={lockedDialogOpen} onClose={handleLockedDialogClose}>
        <DialogTitle>Coming Soon!</DialogTitle>
        <DialogContent>
          Please sign up for alitheia Labs to participate in our upcoming trials!
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLockedDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const WhiteboardWrapper = ({ initialNodes, initialEdges }) => (
  <ReactFlowProvider>
    <Whiteboard initialNodes={initialNodes} initialEdges={initialEdges} />
  </ReactFlowProvider>
);

export default WhiteboardWrapper;
