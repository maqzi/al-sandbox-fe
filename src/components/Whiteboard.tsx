import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'react-flow-renderer';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'INITIAL RATING 0' },
    position: { x: 5, y: 250 },
  },
  {
    id: '2',
    data: { label: 'How many years ago were you diagnosed with diabetes?' },
    position: { x: 200, y: 250 },
  },
  {
    id: '3',
    data: { label: 'Age when diagnosed with diabetes' },
    position: { x: 400, y: 250 },
  },
  {
    id: '4',
    type: 'diamond',
    data: { label: 'Age > 50?' },
    position: { x: 600, y: 250 },
  },
  {
    id: '5',
    data: { label: 'RATING ADD 100' },
    position: { x: 800, y: 100 },
  },
  {
    id: '6',
    data: { label: 'RATING ADD 50' },
    position: { x: 800, y: 400 },
  },
  {
    id: '7',
    data: { label: 'Have you had a mammogram in the last year and do you know the result?' },
    position: { x: 1000, y: 250 },
  },
  {
    id: '8',
    type: 'diamond',
    data: { label: 'Mammogram result known?' },
    position: { x: 1200, y: 250 },
  },
  {
    id: '9',
    data: { label: 'ENTER EMR' },
    position: { x: 1400, y: 100 },
  },
  {
    id: '10',
    data: { label: 'STANDARDIZED KIT' },
    position: { x: 1400, y: 400 },
  },
  {
    id: '11',
    data: { label: 'CHECKING' },
    position: { x: 1600, y: 250 },
  },
  {
    id: '12',
    type: 'output',
    data: { label: 'END' },
    position: { x: 1800, y: 250 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e4-5', source: '4', target: '5', animated: true, label: 'Yes' },
  { id: 'e4-6', source: '4', target: '6', animated: true, label: 'No' },
  { id: 'e5-7', source: '5', target: '7', animated: true },
  { id: 'e6-7', source: '6', target: '7', animated: true },
  { id: 'e7-8', source: '7', target: '8', animated: true },
  { id: 'e8-9', source: '8', target: '9', animated: true, label: 'Yes' },
  { id: 'e8-10', source: '8', target: '10', animated: true, label: 'No' },
  { id: 'e9-11', source: '9', target: '11', animated: true },
  { id: 'e10-11', source: '10', target: '11', animated: true },
  { id: 'e11-12', source: '11', target: '12', animated: true },
];

const Whiteboard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const addRectangle = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `Rectangle ${nodes.length + 1}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addCircle = (type: 'input' | 'output') => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type,
      data: { label: type === 'input' ? 'Start' : 'End' },
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
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <Button variant="contained" color="primary" onClick={addRectangle}>
          Add Rectangle
        </Button>
        <Button variant="contained" color="primary" onClick={() => addCircle('input')}>
          Add Start Node
        </Button>
        <Button variant="contained" color="primary" onClick={() => addCircle('output')}>
          Add End Node
        </Button>
        <Button variant="contained" color="primary" onClick={addDiamond}>
          Add Decision Rhombus
        </Button>
        <Button variant="contained" color="secondary" onClick={removeNode}>
          Remove Node
        </Button>
      </div>
      <Button
        variant="contained"
        color="primary"
        style={{ position: 'absolute', top: 10, right: 10 }}
        onClick={handleDialogOpen}
      >
        Test Rule
      </Button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Feature Locked</DialogTitle>
        <DialogContent>
          Feature locked! Please visit Alitheia Labs booth.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
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