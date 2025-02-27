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

const initialNodes = [
  {
    id: 'start',
    type: 'circle',
    data: { label: 'Start' },
    position: { x: 0, y: 250 },
  },
  {
    id: '1',
    data: { label: 'INITIAL RATING 0' },
    position: { x: 200, y: 250 },
  },
  {
    id: '2',
    type: 'diamond',
    data: { label: 'Applicant Age' },
    position: { x: 400, y: 250 },
  },
  {
    id: '3',
    type: 'diamond',
    data: { label: 'When were you diagnosed with this condition' },
    position: { x: 600, y: 250 },
  },
  {
    id: '4',
    data: { label: 'Calculate age at diagnosis' },
    position: { x: 800, y: 250 },
  },
  {
    id: '5',
    type: 'diamond',
    data: { label: 'Age > 50?' },
    position: { x: 1000, y: 250 },
  },
  {
    id: '6',
    data: { label: 'RATING ADD 100' },
    position: { x: 1200, y: 150 },
  },
  {
    id: '7',
    data: { label: 'RATING ADD 50' },
    position: { x: 1200, y: 350 },
  },
  {
    id: '8',
    type: 'diamond',
    data: { label: 'Have you had a hemoglobin A1c test done in the last year and do you know the result?' },
    position: { x: 1400, y: 250 },
  },
  {
    id: '9',
    type: 'diamond',
    data: { label: 'What was your last known A1c?' },
    position: { x: 1800, y: 250 },
  },
  {
    id: '10',
    data: { label: 'ORDER EHR' },
    position: { x: 1800, y: 150 },
  },
  {
    id: '11',
    data: { label: 'STANDARDIZED NT' },
    position: { x: 2000, y: 350 },
  },
  {
    id: '12',
    data: { label: 'DECLINE' },
    position: { x: 2000, y: 250 },
  },
  {
    id: 'end',
    type: 'circle',
    data: { label: 'End' },
    position: { x: 2200, y: 250 },
  },
];

const initialEdges = [
  { id: 'e-start-1', source: 'start', target: '1', animated: true },
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true },
  { id: 'e5-6', source: '5', target: '6', animated: true, label: '<50' },
  { id: 'e5-7', source: '5', target: '7', animated: true, label: '>=50' },
  { id: 'e6-8', source: '6', target: '8', animated: true },
  { id: 'e7-8', source: '7', target: '8', animated: true },
  { id: 'e8-9', source: '8', target: '9', animated: true, label: 'Yes' },
  { id: 'e8-10', source: '8', target: '10', animated: true, label: 'No' },
  { id: 'e9-11', source: '9', target: '11', animated: true, label: '<=8' },
  { id: 'e9-12', source: '9', target: '12', animated: true, label: '>=10' },
  { id: 'e10-9', source: '10', target: '9', animated: true },
  { id: 'e11-end', source: '11', target: 'end', animated: true },
  { id: 'e12-end', source: '12', target: 'end', animated: true },
];

const nodeTypes = {
  circle: CircleNode,
  diamond: DiamondNode,
};

const Whiteboard = () => {
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
        <Button variant="contained" color="secondary" onClick={removeNode}>
          Remove Last Node
        </Button>
      </div>
      <Button variant="contained" color="primary" style={{ position: 'absolute', top: 10, right: 10, zIndex: 20 }} onClick={handleLockedDialogOpen}>
        Test Rule
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
        <DialogTitle>Feature Locked</DialogTitle>
        <DialogContent>
          Feature locked! Please visit the alitheia Labs booth to try it.
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

const WhiteboardWrapper = () => (
  <ReactFlowProvider>
    <Whiteboard />
  </ReactFlowProvider>
);

export default WhiteboardWrapper;