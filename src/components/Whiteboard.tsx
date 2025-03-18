import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from 'react-flow-renderer';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Paper, Typography, Box, IconButton, Tooltip, Chip, Divider,
  AppBar, Toolbar, Card, CardContent, CircularProgress, Grid,
  InputAdornment, Checkbox, Snackbar, Alert, Badge, Avatar,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer
} from '@mui/material';
import {
  Close, Code, Add, Remove, Timeline,
  Settings, Info, Save, CallSplit, 
  Error as ErrorIcon, SystemUpdateAlt,
  CheckCircle, PlayArrow
} from '@mui/icons-material';
import CircleNode from './CircleNode';
import DiamondNode from './DiamondNode';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  updateRule, 
  setActiveRule, 
  setActiveVersion 
} from '@/store/rulesSlice';
import './css/Whiteboard.css';
import { Position } from 'react-flow-renderer';

// Node types for the ReactFlow component
const nodeTypes = {
  circle: CircleNode,
  diamond: DiamondNode,
};

interface WhiteboardProps {
  onClose: () => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ onClose }) => {
  // Get active rule and version from Redux state
  const activeRule = useSelector((state: RootState) => state.rules.activeRule);
  const activeVersion = useSelector((state: RootState) => state.rules.activeVersion);
  
  // Initialize state from activeVersion
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [thresholdValue, setThresholdValue] = useState('');
  const [ruleSummary, setRuleSummary] = useState({
    nodeCount: 0,
    edgeCount: 0,
    decisionPoints: 0,
    endpoints: 0
  });
  const [thresholdPlaceholder, setThresholdPlaceholder] = useState('e.g. Yes, No, > 5.0, etc.');
  const [thresholdRecommendations, setThresholdRecommendations] = useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendationsShown, setRecommendationsShown] = useState(false);
  const [saveVersionDialogOpen, setSaveVersionDialogOpen] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [versionNote, setVersionNote] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testingInProgress, setTestingInProgress] = useState(false);
  const [testResults, setTestResults] = useState<null | {
    overall: {
      stp: number;
      accuracy: number;
      resourceUtilization: number;
      averageProcessingTime: number;
    },
    cases: Array<{
      id: string;
      name: string;
      result: string;
      outcome: 'approved' | 'rejected' | 'referred';
      processingTime: number;
      risk: 'low' | 'medium' | 'high';
    }>
  }>(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [editedVersionNote, setEditedVersionNote] = useState('');
  const dispatch = useDispatch();

  // Add these state variables to your component
  const [ruleAiDialogOpen, setRuleAiDialogOpen] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [ruleSummaryText, setRuleSummaryText] = useState<string | null>(null);

  // Load nodes and edges when component mounts or when activeVersion changes
  useEffect(() => {
    if (activeVersion) {
      // Initialize the flow with nodes and edges from the active version
      setNodes(activeVersion.nodes || []);
      setEdges(activeVersion.edges || []);
      
      // Calculate statistics
      const nodeCount = activeVersion.nodes?.length || 0;
      const edgeCount = activeVersion.edges?.length || 0;
      const decisionPoints = activeVersion.nodes?.filter(node => node.type === 'diamond').length || 0;
      const endpoints = activeVersion.nodes?.filter(node => 
        node.data?.label === 'End' || 
        node.type === 'circle' && node.id !== 'start'
      ).length || 0;
      
      setRuleSummary({ nodeCount, edgeCount, decisionPoints, endpoints });
    }
  }, [activeVersion, setNodes, setEdges]);

  // Add this useEffect to detect changes and update hasUnsavedChanges flag
  useEffect(() => {
    // Skip initialization effect
    if (!activeVersion || !activeVersion.nodes || !activeVersion.edges) return;
    
    // Only check for changes after initial load
    const initialNodes = JSON.stringify(activeVersion.nodes);
    const initialEdges = JSON.stringify(activeVersion.edges);
    
    const checkForChanges = () => {
      const currentNodes = JSON.stringify(nodes);
      const currentEdges = JSON.stringify(edges);
      
      const hasChanges = 
        initialNodes !== currentNodes || 
        initialEdges !== currentEdges;
      
      setHasUnsavedChanges(hasChanges);
    };
    
    // Use a timeout to avoid excessive checking during rapid changes
    const changeTimer = setTimeout(checkForChanges, 500);
    
    return () => clearTimeout(changeTimer);
  }, [nodes, edges, activeVersion]);

  // Early return if no active rule or version
  if (!activeRule || !activeVersion) {
    return (
      <Box className="whiteboard-error-container">
        <Paper className="whiteboard-error-paper">
          <ErrorIcon className="whiteboard-error-icon" />
          <Typography variant="h6" gutterBottom>
            No Active Rule or Version Found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please select a rule and version to start editing.
          </Typography>
          <Button 
            variant="contained"
            color="primary"
            onClick={onClose}
            startIcon={<Close />}
            className="whiteboard-back-button"
          >
            Go Back
          </Button>
        </Paper>
      </Box>
    );
  }

  const onConnect = useCallback(
    (params) => {
      // Use step line edges for more structured connections
      const newEdge = {
        ...params,
        type: 'smoothstep', // Use smoothstep for more horizontal paths
        animated: true,
        style: { strokeWidth: 3 },
        labelStyle: { 
          fill: '#1a3353', 
          fontWeight: 500, 
          fontSize: 12,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
        },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { 
          fill: '#ffffff', 
          fillOpacity: 0.8,
          stroke: '#e6e8f0',
          strokeWidth: 1
        }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
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
    setThresholdValue('');
    setThresholdRecommendations([]);
    setLoadingRecommendations(false);
    setRecommendationsShown(false);
  };

  const handleEdgeClick = (event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
    setThresholdValue(edge.label || '');
    setRecommendationsShown(false); // Reset recommendations state
    
    // Analyze the connection for better suggestions
    let placeholderSuggestion = 'e.g. Yes, No, > 5.0';
    
    // Find the source node (where the edge starts)
    const sourceNode = nodes.find(n => n.id === edge.source);
    if (sourceNode?.type === 'diamond') {
      // If coming from a decision node, suggest Yes/No or similar
      placeholderSuggestion = 'e.g. Yes, No, True, False';
      
      // If the decision has specific wording, make better suggestions
      if (sourceNode.data?.label) {
        const label = sourceNode.data.label.toLowerCase();
        if (label.includes('diabetes') || label.includes('a1c')) {
          placeholderSuggestion = 'e.g. > 6.5%, < 5.7%, Normal Range';
        } else if (label.includes('bmi')) {
          placeholderSuggestion = 'e.g. > 30, 25-30, < 25';
        } else if (label.includes('sleep') || label.includes('apnea')) {
          placeholderSuggestion = 'e.g. AHI > 30, AHI 5-15, Normal';
        }
      }
    }
    
    setThresholdPlaceholder(placeholderSuggestion);
    setDialogOpen(true);
  };

  const handleThresholdChange = (event) => {
    setThresholdValue(event.target.value);
  };

  const handleThresholdSubmit = () => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === selectedEdge.id ? { ...edge, label: thresholdValue } : edge
      )
    );
    handleDialogClose();
  };

  const addRectangle = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      data: { label: `Action ${ruleSummary.nodeCount + 1}` },
      position: { x: 100, y: 200 },
    };
    setNodes((nds) => nds.concat(newNode));
    setRuleSummary(prev => ({ ...prev, nodeCount: prev.nodeCount + 1 }));
  };

  const addCircle = (label) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'circle',
      data: { label },
      position: { x: 100, y: 100 },
    };
    setNodes((nds) => nds.concat(newNode));
    setRuleSummary(prev => ({ ...prev, nodeCount: prev.nodeCount + 1 }));
    
    // If adding an End node, increment endpoint count
    if (label === 'End') {
      setRuleSummary(prev => ({ ...prev, endpoints: prev.endpoints + 1 }));
    }
  };

  const addDiamond = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'diamond',
      data: { label: `Decision ${ruleSummary.decisionPoints + 1}` },
      position: { x: 100, y: 300 },
    };
    setNodes((nds) => nds.concat(newNode));
    setRuleSummary(prev => ({ 
      ...prev, 
      nodeCount: prev.nodeCount + 1,
      decisionPoints: prev.decisionPoints + 1 
    }));
  };

  const removeNode = () => {
    if (nodes.length === 0) return;
    
    const lastNode = nodes[nodes.length - 1];
    setNodes((nds) => nds.slice(0, -1));
    
    // Update statistics
    setRuleSummary(prev => {
      const updatedStats = { ...prev, nodeCount: prev.nodeCount - 1 };
      
      if (lastNode.type === 'diamond') {
        updatedStats.decisionPoints = prev.decisionPoints - 1;
      }
      
      if (
        lastNode.data?.label === 'End' || 
        lastNode.type === 'circle' && lastNode.id !== 'start'
      ) {
        updatedStats.endpoints = prev.endpoints - 1;
      }
      
      return updatedStats;
    });
    
    // Remove any edges connected to this node
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== lastNode.id && edge.target !== lastNode.id
    ));
  };

  // Add a function to arrange nodes in a horizontal layout
  const applyHorizontalLayout = useCallback(() => {
    if (!nodes.length) return;
    
    // Find start and end nodes
    const startNode = nodes.find(node => node.id === 'start' || node.data?.label === 'Start');
    
    // Group nodes by their conceptual "level" in the flow
    // This is a simplified algorithm - you may need to adjust based on your specific flow
    const levels: { [key: string]: any[] } = {};
    const processed = new Set<string>();
    
    // Start with the start node as level 0
    if (startNode) {
      levels['0'] = [startNode];
      processed.add(startNode.id);
    }
    
    // Function to find all direct targets of a node
    const findTargets = (nodeId: string) => {
      return edges
        .filter(edge => edge.source === nodeId)
        .map(edge => edge.target);
    };
    
    // Breadth-first traversal to assign levels
    let currentLevel = 0;
    while (Object.keys(levels).includes(currentLevel.toString())) {
      const nextLevel = currentLevel + 1;
      levels[nextLevel.toString()] = [];
      
      // For each node in the current level, find its targets
      for (const node of levels[currentLevel.toString()]) {
        const targets = findTargets(node.id);
        
        for (const targetId of targets) {
          if (!processed.has(targetId)) {
            const targetNode = nodes.find(n => n.id === targetId);
            if (targetNode) {
              levels[nextLevel.toString()].push(targetNode);
              processed.add(targetId);
            }
          }
        }
      }
      
      // If no nodes were added to this level, remove it
      if (levels[nextLevel.toString()].length === 0) {
        delete levels[nextLevel.toString()];
      }
      
      currentLevel = nextLevel;
    }
    
    // Position nodes horizontally by level
    const xGap = 300; // horizontal gap between levels
    const yGap = 150; // vertical gap between nodes in the same level
    const updatedNodes = [...nodes];
    
    // Update positions for each node based on its level
    Object.keys(levels).forEach((level) => {
      const levelNodes = levels[level];
      const levelX = parseInt(level) * xGap + 100; // X position based on level
      
      levelNodes.forEach((node, index) => {
        // Calculate Y position to center the nodes in each level
        const levelHeight = levelNodes.length * yGap;
        const startY = 100 + (500 - levelHeight) / 2;
        const nodeY = startY + index * yGap;
        
        // Find and update the node in our updatedNodes array
        const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
        if (nodeIndex !== -1) {
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            position: { x: levelX, y: nodeY }
          };
        }
      });
    });
    
    // Handle any nodes not placed (not connected to the main flow)
    const unplacedNodes = updatedNodes.filter(node => !processed.has(node.id));
    if (unplacedNodes.length > 0) {
      // Position these at the far right
      const maxLevel = Math.max(...Object.keys(levels).map(l => parseInt(l)), 0);
      const extraX = (maxLevel + 1) * xGap + 100;
      
      unplacedNodes.forEach((node, index) => {
        const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
        if (nodeIndex !== -1) {
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            position: { x: extraX, y: 100 + index * yGap }
          };
        }
      });
    }
    
    setNodes(updatedNodes);
  }, [nodes, edges, setNodes]);

  const askRuleAI = useCallback(() => {
    setLoadingRecommendations(true);
    
    // Simulate an API delay for generating recommendations
    setTimeout(() => {
      // Generate smart recommendations based on the source node type and data
      const sourceNode = nodes.find(n => n.id === selectedEdge?.source);
      let recommendations: string[] = ['Yes', 'No'];
      
      if (sourceNode?.type === 'diamond') {
        if (sourceNode.data?.label) {
          const label = sourceNode.data.label.toLowerCase();
          
          if (label.includes('diabetes') || label.includes('a1c')) {
            recommendations = [
              '> 6.5% (Diabetes)',
              '5.7% - 6.4% (Prediabetes)',
              '< 5.7% (Normal)',
              'No recent data'
            ];
          } else if (label.includes('bmi')) {
            recommendations = [
              '≥ 30 (Obese)',
              '25 - 29.9 (Overweight)',
              '18.5 - 24.9 (Normal)',
              '< 18.5 (Underweight)'
            ];
          } else if (label.includes('sleep') || label.includes('apnea') || label.includes('osa')) {
            recommendations = [
              'AHI < 5 (Normal)',
              'AHI 5-15 (Mild)',
              'AHI 15-30 (Moderate)',
              'AHI > 30 (Severe)',
              'No CPAP compliance'
            ];
          } else if (label.includes('treatment') || label.includes('medication')) {
            recommendations = [
              'Currently treating',
              'Previously treated',
              'Never treated',
              'Treatment declined'
            ];
          } else if (label.includes('risk')) {
            recommendations = [
              'Low risk',
              'Medium risk',
              'High risk',
              'Requires review'
            ];
          }
        }
      }
      
      // Add generic recommendations if we don't have enough context-specific ones
      if (recommendations.length < 3) {
        recommendations = [...recommendations, 'True', 'False', 'Requires manual review'];
      }
      
      setThresholdRecommendations(recommendations);
      setLoadingRecommendations(false);
      setRecommendationsShown(true);
    }, 1200); // Delay for 1.2 seconds for effect
  }, [nodes, selectedEdge]);

  const applyRecommendation = (recommendation: string) => {
    setThresholdValue(recommendation);
  };

  // Function to handle opening save dialog
  const handleSaveClick = () => {
    // If no changes, show notification and return
    if (!hasUnsavedChanges) {
      // Optional: display a "No changes to save" toast notification
      return;
    }

    // Calculate the next version number based on the current version
    const currentVersion = activeVersion?.version || '1.0';
    const parts = currentVersion.split('.');
    const majorVersion = parseInt(parts[0] || '1');
    const minorVersion = parseInt(parts[1] || '0');
    const suggestedVersion = `${majorVersion}.${minorVersion + 1}`;
    
    setNewVersion(suggestedVersion);
    setVersionNote(`Updated rule flow for ${activeRule?.name}`);
    setSaveVersionDialogOpen(true);
  };

  // Function to handle the actual save operation
  const handleSaveVersion = () => {
    if (!activeRule || !activeVersion) return;

    // Create new version object with current nodes and edges
    const newVersionObj = {
      version: newVersion,
      tag: 'latest', // Mark as latest
      note: versionNote,
      nodes: nodes, // Current nodes
      edges: edges  // Current edges
    };

    // Update existing versions to remove 'latest' tag from others
    const updatedVersions = activeRule.versions.map(v => ({
      ...v,
      tag: v.tag === 'latest' ? undefined : v.tag
    }));

    // Create the updated rule with new version
    const updatedRule = {
      ...activeRule,
      versions: [...updatedVersions, newVersionObj],
      activeVersionId: newVersion
    };

    // Dispatch action to update the rule in Redux
    dispatch(updateRule(updatedRule));
    
    // Also update the active rule and version in the Redux store
    dispatch(setActiveRule(updatedRule));
    dispatch(setActiveVersion(newVersionObj));

    // Close dialog and show success notification
    setSaveVersionDialogOpen(false);
    setSaveSuccess(true);
    setHasUnsavedChanges(false);
    
    // Update rule summary with the latest counts
    setRuleSummary({
      nodeCount: nodes.length,
      edgeCount: edges.length,
      decisionPoints: nodes.filter(node => node.type === 'diamond').length,
      endpoints: nodes.filter(node => 
        node.data?.label === 'End' || 
        (node.type === 'circle' && node.id !== 'start')
      ).length
    });
    
    // Hide success notification after a few seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Add function to handle closing save dialog
  const handleSaveDialogClose = () => {
    setSaveVersionDialogOpen(false);
  };

  // Add this function to handle the test button click
  const handleTestRuleClick = () => {
    setTestDialogOpen(true);
    setTestingInProgress(true);
    
    // Simulate rule testing with sample data
    setTimeout(() => {
      // Generate mock test results
      const results = {
        overall: {
          stp: Math.floor(70 + Math.random() * 25), // 70-95%
          accuracy: Math.floor(85 + Math.random() * 10), // 85-95%
          resourceUtilization: Math.floor(60 + Math.random() * 30), // 60-90%
          averageProcessingTime: Math.floor(30 + Math.random() * 60), // 30-90 seconds
        },
        cases: [
          {
            id: 'CASE-2023-0001',
            name: 'John Smith',
            result: 'A1c: 7.2%, BMI: 32.5, Sleep Apnea: AHI > 30',
            outcome: 'referred' as const,
            processingTime: 45,
            risk: 'medium' as const,
          },
          {
            id: 'CASE-2023-0002',
            name: 'Emma Johnson',
            result: 'A1c: 5.5%, BMI: 24.3, No Sleep Apnea',
            outcome: 'approved' as const,
            processingTime: 28,
            risk: 'low' as const,
          },
          {
            id: 'CASE-2023-0003',
            name: 'Michael Brown',
            result: 'A1c: 8.1%, BMI: 35.2, Sleep Apnea: AHI > 30, No CPAP Compliance',
            outcome: 'rejected' as const,
            processingTime: 52,
            risk: 'high' as const,
          },
          {
            id: 'CASE-2023-0004',
            name: 'Sarah Williams',
            result: 'A1c: 6.2%, BMI: 27.8, Sleep Apnea: AHI 5-15, CPAP Compliant',
            outcome: 'approved' as const,
            processingTime: 38,
            risk: 'medium' as const,
          },
          {
            id: 'CASE-2023-0005',
            name: 'David Miller',
            result: 'A1c: 9.3%, BMI: 36.7, Sleep Apnea: AHI > 30',
            outcome: 'rejected' as const,
            processingTime: 41,
            risk: 'high' as const,
          }
        ]
      };
      
      setTestResults(results);
      setTestingInProgress(false);
    }, 2000); // 2 second delay to simulate processing
  };

  // Add this function to handle dialog close
  const handleTestDialogClose = () => {
    setTestDialogOpen(false);
    setTestResults(null);
  };

  // Add function to handle opening the settings dialog
  const handleSettingsDialogOpen = () => {
    // Initialize the note field with the current version note
    setEditedVersionNote(activeVersion?.note || '');
    setSettingsDialogOpen(true);
  };

  // Add function to handle closing the settings dialog
  const handleSettingsDialogClose = () => {
    setSettingsDialogOpen(false);
  };

  // Add function to save updated version note
  const handleUpdateVersionNote = () => {
    if (!activeRule || !activeVersion) return;

    // Create updated version object
    const updatedVersionObj = {
      ...activeVersion,
      note: editedVersionNote
    };

    // Update the version in the rule's versions array
    const updatedVersions = activeRule.versions.map(v => 
      v.version === activeVersion.version ? updatedVersionObj : v
    );

    // Create the updated rule
    const updatedRule = {
      ...activeRule,
      versions: updatedVersions
    };

    // Dispatch action to update the rule in Redux
    dispatch(updateRule(updatedRule));
    
    // Also update the active version in the Redux store
    dispatch(setActiveVersion(updatedVersionObj));

    // Show temporary success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
    
    // Close dialog
    setSettingsDialogOpen(false);
  };

  // Replace the existing handleLockedDialogOpen function with this new function
  const handleRuleAiClick = () => {
    setRuleAiDialogOpen(true);
    setGeneratingSummary(true);
    
    // Simulate AI generating a summary based on the rule structure
    setTimeout(() => {
      // Create an intelligent summary based on the rule's structure
      const decisionNodes = nodes.filter(node => node.type === 'diamond');
      const endNodes = nodes.filter(node => 
        node.data?.label === 'End' || 
        (node.type === 'circle' && node.id !== 'start')
      );
      
      // Extract decision points and labeled edges
      const decisionPoints = decisionNodes.map(node => node.data?.label || 'Decision').join(', ');
      const thresholds = edges.filter(edge => edge.label).map(edge => edge.label).join(', ');
      
      // Construct the rule summary based on structure
      let summary = `This rule "${activeRule.name}" (version ${activeVersion.version}) `;
      
      if (decisionNodes.length > 0) {
        summary += `evaluates ${decisionNodes.length} key decision points `;
        if (decisionPoints) {
          summary += `including ${decisionPoints}. `;
        } else {
          summary += `. `;
        }
      }
      
      if (edges.filter(edge => edge.label).length > 0) {
        summary += `It includes conditional paths based on thresholds such as ${thresholds}. `;
      }
      
      if (endNodes.length > 1) {
        summary += `The rule can result in ${endNodes.length} different outcomes depending on the evaluation path. `;
      } else {
        summary += `The rule leads to a single outcome after evaluation. `;
      }
      
      // Add context-specific insights based on node labels
      const diabetesRelated = nodes.some(node => 
        node.data?.label && 
        node.data.label.toLowerCase().includes('diabetes')
      );
      
      const sleepApneaRelated = nodes.some(node => 
        node.data?.label && 
        (node.data.label.toLowerCase().includes('sleep') || node.data.label.toLowerCase().includes('apnea'))
      );
      
      const bmiRelated = nodes.some(node => 
        node.data?.label && 
        node.data.label.toLowerCase().includes('bmi')
      );
      
      if (diabetesRelated || sleepApneaRelated || bmiRelated) {
        summary += `This rule appears to be evaluating health conditions including `;
        const conditions = [];
        if (diabetesRelated) conditions.push('diabetes');
        if (sleepApneaRelated) conditions.push('sleep apnea');
        if (bmiRelated) conditions.push('BMI');
        
        summary += conditions.join(', ');
        summary += ` to determine appropriate underwriting actions. `;
      }
      
      summary += `\n\nThis rule design follows ${
        nodes.length > 10 ? 'a complex' : 'a straightforward'
      } decision tree structure with ${nodes.length} nodes and ${edges.length} connections. `;
      
      summary += `\n\nRecommendation: ${
        decisionNodes.length > 5 
          ? 'Consider simplifying some decision paths to improve rule readability and maintenance.' 
          : 'The current design has good balance between complexity and readability.'
      }`;
      
      setRuleSummaryText(summary);
      setGeneratingSummary(false);
    }, 2000);
  };

  // Add function to close the dialog
  const handleRuleAiDialogClose = () => {
    setRuleAiDialogOpen(false);
  };

  return (
    <Box className="whiteboard-container">
      {/* Header */}
      <AppBar position="static" color="inherit" elevation={0} className="whiteboard-header">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} className="whiteboard-close-btn">
            <Close />
          </IconButton>
          
          <Box className="whiteboard-title">
            <Typography variant="h6" noWrap component="div">
              {activeRule.name}
            </Typography>
            <Chip 
              label={`Version: ${activeVersion.version}`}
              size="small"
              color="primary"
              className="whiteboard-version-chip"
            />
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box className="whiteboard-actions">
            <Tooltip title={hasUnsavedChanges ? "Save Changes" : "No Changes to Save"}>
              <span>
                <IconButton 
                  color="primary" 
                  className="whiteboard-action-btn"
                  onClick={handleSaveClick}
                  disabled={!hasUnsavedChanges}
                >
                  <Badge 
                    color="error" 
                    variant="dot" 
                    invisible={!hasUnsavedChanges}
                  >
                    <Save />
                  </Badge>
                </IconButton>
              </span>
            </Tooltip>
            
            <Tooltip title="Test Rule">
              <IconButton 
                color="secondary" 
                onClick={handleTestRuleClick}
                className="whiteboard-action-btn"
              >
                <PlayArrow />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Rule Settings">
              <IconButton
                onClick={handleSettingsDialogOpen}
                className="whiteboard-action-btn"
              >
                <Settings />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleRuleAiClick}
              startIcon={<Code />}
              className="whiteboard-ai-btn"
            >
              Rule AI
            </Button>
            <Tooltip title="Auto-arrange Flow">
              <IconButton 
                color="primary" 
                onClick={applyHorizontalLayout}
                className="whiteboard-action-btn"
              >
                <Timeline />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box className="whiteboard-content">
        {/* Side panel */}
        <Paper className="whiteboard-side-panel">
          <Typography variant="subtitle2" className="side-panel-header">
            Add Elements
          </Typography>
          
          <Divider />
          
          <Box className="side-panel-buttons">
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => addCircle('Start')}
              startIcon={<CheckCircle />}
              className="side-panel-btn"
              fullWidth
            >
              Start Node
            </Button>
            
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => addCircle('End')}
              startIcon={<ErrorIcon />}
              className="side-panel-btn"
              fullWidth
            >
              End Node
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={addDiamond}
              startIcon={<CallSplit />}
              className="side-panel-btn"
              fullWidth
            >
              Decision Node
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={addRectangle}
              startIcon={<SystemUpdateAlt />}
              className="side-panel-btn"
              fullWidth
            >
              Action Node
            </Button>
            
            <Button 
              variant="outlined"
              color="warning" 
              onClick={removeNode}
              startIcon={<Remove />}
              className="side-panel-btn"
              fullWidth
              disabled={nodes.length === 0}
            >
              Remove Last
            </Button>
          </Box>
          
          <Box className="side-panel-rule-info">
            <Typography variant="subtitle2" className="side-panel-header">
              Rule Information
            </Typography>
            
            <Divider />
            
            <Box className="rule-info-content">
              <Typography variant="body2">
                <strong>Rule:</strong> {activeRule.name}
              </Typography>
              <Typography variant="body2">
                <strong>Version:</strong> {activeVersion.version}
                {activeVersion.tag === 'latest' && (
                  <Chip label="Latest" size="small" color="primary" className="latest-tag" />
                )}
              </Typography>
              {activeVersion.note && (
                <Typography variant="body2">
                  <strong>Note:</strong> {activeVersion.note}
                </Typography>
              )}
              
              <Divider className="rule-info-divider" />
              
              <Typography variant="body2">
                <strong>Nodes:</strong> {ruleSummary.nodeCount}
              </Typography>
              <Typography variant="body2">
                <strong>Connections:</strong> {ruleSummary.edgeCount} 
                {edges.filter(e => e.label).length > 0 ? ` (${edges.filter(e => e.label).length} with thresholds)` : ''}
              </Typography>
              <Typography variant="body2">
                <strong>Decision Points:</strong> {ruleSummary.decisionPoints}
              </Typography>
              <Typography variant="body2">
                <strong>Endpoints:</strong> {ruleSummary.endpoints}
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        {/* Flow Editor */}
        <Box className="flow-editor-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={(params) => {
              // Use step line edges for more structured connections
              const newEdge = {
                ...params,
                type: 'smoothstep', // Use smoothstep for more horizontal paths
                animated: true,
                style: { strokeWidth: 3 },
                labelStyle: { 
                  fill: '#1a3353', 
                  fontWeight: 500, 
                  fontSize: 12,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                },
                labelBgPadding: [8, 4],
                labelBgBorderRadius: 4,
                labelBgStyle: { 
                  fill: '#ffffff', 
                  fillOpacity: 0.8,
                  stroke: '#e6e8f0',
                  strokeWidth: 1
                }
              };
              setEdges((eds) => addEdge(newEdge, eds));
            }}
            onEdgeClick={handleEdgeClick}
            fitView
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
              type: 'smoothstep', // Default to smoothstep type
              style: { strokeWidth: 3 },
              labelStyle: { 
                fill: '#1a3353', 
                fontWeight: 500, 
                fontSize: 12,
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
              },
              labelBgPadding: [8, 4],
              labelBgBorderRadius: 4,
              labelBgStyle: { 
                fill: '#ffffff', 
                fillOpacity: 0.8,
                stroke: '#e6e8f0',
                strokeWidth: 1
              }
            }}
            connectionLineType="smoothstep" // Consistent with edge type
            connectionLineStyle={{ stroke: '#5c6bc0', strokeWidth: 3, strokeDasharray: '5,3' }}
            snapToGrid={true}
            snapGrid={[20, 20]} // Align to a 20px grid
            className="reactflow-wrapper"
          >
            <MiniMap 
              nodeStrokeColor={(n) => n.style?.stroke || '#42a5f5'}
              nodeColor={(n) => n.style?.background || '#fff'} 
              nodeBorderRadius={2}
            />
            <Controls />
            <Background color="#aaa" gap={20} size={1} />
          </ReactFlow>
          
          {/* Status bar - replacing the Panel component */}
          <Box className="status-bar">
            <Paper className="flow-info-panel">
              <Typography variant="caption">
                {nodes.length} nodes | {edges.length} connections {edges.filter(e => e.label).length > 0 ? ` | ${edges.filter(e => e.label).length} with thresholds` : ''}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
      
      {/* Dialogs */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        PaperProps={{ 
          className: "whiteboard-dialog",
          style: { 
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#f5f7fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px'
        }}>
          <Box display="flex" alignItems="center">
            <CallSplit sx={{ color: '#5569ff', marginRight: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Set Connection Threshold
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDialogClose}
            aria-label="close"
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set a threshold value for this connection. This determines when this path will be taken in the rule's execution flow.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Threshold Value"
            type="text"
            fullWidth
            value={thresholdValue}
            onChange={handleThresholdChange}
            placeholder={thresholdPlaceholder}
            variant="outlined"
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ 
                  color: '#5569ff', 
                  marginRight: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <CallSplit fontSize="small" />
                </Box>
              ),
            }}
          />
          
          {/* Rule AI Section */}
          <Box sx={{ mt: 3 }}>
            {!recommendationsShown ? (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Code />}
                onClick={askRuleAI}
                disabled={loadingRecommendations}
                fullWidth
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  height: 42
                }}
              >
                {loadingRecommendations ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Generating recommendations...
                  </>
                ) : (
                  'Ask Rule AI for recommendations'
                )}
              </Button>
            ) : (
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 1.5
                }}>
                  <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Code fontSize="small" sx={{ mr: 0.5 }} /> AI Recommendations
                  </Typography>
                  <Chip 
                    label="AI-generated" 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.65rem', 
                      bgcolor: 'rgba(85, 105, 255, 0.1)', 
                      color: '#5569ff',
                      fontWeight: 500
                    }} 
                  />
                </Box>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1,
                    bgcolor: 'rgba(240, 244, 255, 0.4)'
                  }}
                >
                  <Grid container spacing={1}>
                    {thresholdRecommendations.map((rec, index) => (
                      <Grid item xs={6} key={index}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => applyRecommendation(rec)}
                          sx={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                            color: 'text.primary',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'rgba(85, 105, 255, 0.04)',
                            }
                          }}
                        >
                          {rec}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>
            )}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'rgba(25, 118, 210, 0.05)',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(25, 118, 210, 0.1)',
            mt: 2
          }}>
            <Info fontSize="small" sx={{ color: 'primary.main', marginRight: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Thresholds help explain the logic of branch decisions. Click "Ask Rule AI" for context-aware suggestions.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={handleDialogClose} 
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleThresholdSubmit} 
            variant="contained"
            color="primary"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
            }}
          >
            Save Threshold
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog 
        open={lockedDialogOpen} 
        onClose={handleLockedDialogClose}
        PaperProps={{ className: "whiteboard-dialog" }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Coming Soon!</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Please sign up for alitheia Labs to participate in our upcoming trials!
          </Typography>
          <Box className="feature-preview" mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Features included in alitheia Labs:
            </Typography>
            <ul className="feature-list">
              <li>Advanced rule testing</li>
              <li>AI-assisted rule creation and explanation</li>
              <li>Rule validation and optimization</li>
            </ul>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLockedDialogClose} color="primary" variant="outlined">
            Maybe Later
          </Button>
          <Button onClick={handleLockedDialogClose} color="primary" variant="contained">
            Learn More
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={saveVersionDialogOpen}
        onClose={handleSaveDialogClose}
        PaperProps={{ 
          style: { 
            borderRadius: '12px',
            maxWidth: '450px'
          } 
        }}
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#f5f7fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px'
        }}>
          <Box display="flex" alignItems="center">
            <Save sx={{ color: '#5569ff', marginRight: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Save Rule Version
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleSaveDialogClose}
            aria-label="close"
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '24px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Save your changes as a new version of this rule. This will allow you to roll back to previous versions if needed.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            id="version"
            label="Version Number"
            type="text"
            fullWidth
            variant="outlined"
            value={newVersion}
            onChange={(e) => setNewVersion(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">v</InputAdornment>,
            }}
            helperText="Use semantic versioning (e.g., 1.0, 1.1, 2.0)"
          />
          
          <TextField
            margin="dense"
            id="note"
            label="Version Notes"
            placeholder="Describe what changes you made in this version"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={versionNote}
            onChange={(e) => setVersionNote(e.target.value)}
          />
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 3,
            p: 2, 
            bgcolor: 'rgba(85, 105, 255, 0.05)',
            borderRadius: 1,
            border: '1px solid rgba(85, 105, 255, 0.1)'
          }}>
            <Checkbox 
              checked={true} 
              disabled 
              sx={{ '& .MuiSvgIcon-root': { fontSize: 22 } }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Mark as latest version
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This version will be used when the rule is executed
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'rgba(255, 193, 7, 0.1)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 193, 7, 0.2)',
            mt: 3
          }}>
            <Info fontSize="small" sx={{ color: '#ff9800', marginRight: 1 }} />
            <Typography variant="caption" color="text.secondary">
              <strong>Note:</strong> Saved versions are temporary for this demo and will be lost if you refresh the page.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            onClick={handleSaveDialogClose} 
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveVersion} 
            variant="contained"
            color="primary"
            disabled={!newVersion.trim()}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
            }}
          >
            Save Version
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={() => setSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSaveSuccess(false)} 
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Version {newVersion} saved successfully! <em>(Changes will be lost on refresh)</em>
        </Alert>
      </Snackbar>

      {/* Test Rule Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={handleTestDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          style: { 
            borderRadius: '12px',
            overflow: 'hidden'
          } 
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#f5f7fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px'
        }}>
          <Box display="flex" alignItems="center">
            <PlayArrow sx={{ color: '#5569ff', marginRight: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Rule Test Results
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleTestDialogClose}
            aria-label="close"
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '24px' }}>
          {testingInProgress ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 4
            }}>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Testing Rule on Sample Cases
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Running {activeRule?.name} (Version {activeVersion?.version}) against 5 sample cases...
              </Typography>
            </Box>
          ) : testResults ? (
            <React.Fragment>
              {/* Rule Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Test Summary
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'rgba(85, 105, 255, 0.03)', border: '1px solid rgba(85, 105, 255, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2">
                    This report shows the projected performance metrics if this version of the rule ({activeVersion?.version}) 
                    was deployed to production, while keeping all other rules constant. The metrics below are derived from testing 
                    against a sample of real cases.
                  </Typography>
                </Paper>
              </Box>

              {/* Overall metrics */}
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Business Impact Metrics
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #e6f0ff',
                        height: '100%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                        <CircularProgress
                          variant="determinate"
                          value={testResults.overall.stp}
                          size={80}
                          thickness={4}
                          sx={{ color: '#5569ff' }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            color="text.primary"
                            sx={{ fontWeight: 600 }}
                          >
                            {testResults.overall.stp}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600 }}>
                        Straight-Through Processing
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center">
                        Cases processed without manual review
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #e6f0ff',
                        height: '100%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                        <CircularProgress
                          variant="determinate"
                          value={testResults.overall.accuracy}
                          size={80}
                          thickness={4}
                          sx={{ color: '#00ab55' }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            color="text.primary"
                            sx={{ fontWeight: 600 }}
                          >
                            {testResults.overall.accuracy}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600 }}>
                        Accuracy
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center">
                        Correct risk assessments vs. expert review
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #e6f0ff',
                        height: '100%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                        <CircularProgress
                          variant="determinate"
                          value={testResults.overall.resourceUtilization}
                          size={80}
                          thickness={4}
                          sx={{ color: '#ff9800' }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            color="text.primary"
                            sx={{ fontWeight: 600 }}
                          >
                            {testResults.overall.resourceUtilization}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600 }}>
                        Resource Optimization
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center">
                        Underwriter capacity freed up
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #e6f0ff',
                        height: '100%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box sx={{ display: 'inline-flex', mb: 1 }}>
                        <Typography
                          variant="h4"
                          component="div"
                          color="text.primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {testResults.overall.averageProcessingTime}
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ ml: 0.5, fontWeight: 500, color: 'text.secondary', verticalAlign: 'bottom' }}
                          >
                            sec
                          </Typography>
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" align="center" sx={{ fontWeight: 600 }}>
                        Avg. Processing Time
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center">
                        Per case processing speed
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Case Results Table */}
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Sample Case Results
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Case ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Case Details</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Result</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Risk</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {testResults.cases.map((caseItem) => (
                      <TableRow key={caseItem.id} sx={{ '&:hover': { bgcolor: '#f8faff' } }}>
                        <TableCell>{caseItem.id}</TableCell>
                        <TableCell>{caseItem.name}</TableCell>
                        <TableCell>{caseItem.result}</TableCell>
                        <TableCell>
                          <Chip
                            label={caseItem.outcome === 'approved' ? 'Approved' : caseItem.outcome === 'rejected' ? 'Rejected' : 'Referred'}
                            size="small"
                            color={caseItem.outcome === 'approved' ? 'success' : caseItem.outcome === 'rejected' ? 'error' : 'warning'}
                            sx={{ 
                              fontWeight: 500, 
                              fontSize: '0.7rem', 
                              height: 20,
                              borderRadius: 1
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={caseItem.risk}
                            size="small"
                            sx={{ 
                              fontWeight: 500, 
                              fontSize: '0.7rem', 
                              height: 20,
                              borderRadius: 1,
                              bgcolor: caseItem.risk === 'low' ? '#deffee' : caseItem.risk === 'medium' ? '#fff4e6' : '#feecec',
                              color: caseItem.risk === 'low' ? '#00ab55' : caseItem.risk === 'medium' ? '#ff9800' : '#f44336',
                              border: '1px solid',
                              borderColor: caseItem.risk === 'low' ? '#b2eacc' : caseItem.risk === 'medium' ? '#ffd4a8' : '#ffc7c7',
                            }}
                          />
                        </TableCell>
                        <TableCell>{caseItem.processingTime} sec</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Recommendations */}
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Recommendations
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid rgba(0, 171, 85, 0.2)',
                    bgcolor: 'rgba(0, 171, 85, 0.04)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <CheckCircle sx={{ color: '#00ab55', mr: 1.5, mt: 0.2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#00ab55' }}>
                        Rule Efficiency
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This rule version shows {testResults.overall.stp > 75 ? 'excellent' : 'good'} STP rates. Consider 
                        {testResults.overall.stp < 80 ? ' increasing automation for medium risk cases to improve STP rates further.' : ' maintaining this level of automation in the production version.'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <CheckCircle sx={{ color: '#00ab55', mr: 1.5, mt: 0.2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#00ab55' }}>
                        Decision Consistency
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        The rule shows high consistency in outcomes for similar risk profiles. This will help maintain fair and 
                        equitable underwriting decisions across all applications.
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircle sx={{ color: '#00ab55', mr: 1.5, mt: 0.2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#00ab55' }}>
                        Resource Impact
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This rule configuration would free up approximately {testResults.overall.resourceUtilization}% of underwriter 
                        capacity, allowing focus on complex cases and strategic activities.
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
              
            </React.Fragment>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 4
            }}>
              <Typography variant="body1" color="text.secondary">
                No test results available.
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #f0f0f0'
        }}>
          {!testingInProgress && testResults && (
            <Button 
              startIcon={<SystemUpdateAlt />}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                mr: 'auto'
              }}
            >
              Export Results
            </Button>
          )}
          <Button 
            onClick={handleTestDialogClose} 
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Close
          </Button>
          {!testingInProgress && testResults && (
            <Button 
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
              }}
              onClick={() => {
                handleTestDialogClose();
                // Here you could navigate to the workbench or other testing environment
              }}
            >
              Go to Workbench
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={settingsDialogOpen}
        onClose={handleSettingsDialogClose}
        PaperProps={{ 
          style: { 
            borderRadius: '12px',
            maxWidth: '450px'
          } 
        }}
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: '#f5f7fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px'
        }}>
          <Box display="flex" alignItems="center">
            <Settings sx={{ color: '#5569ff', marginRight: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Rule Settings
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleSettingsDialogClose}
            aria-label="close"
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '24px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update the settings for this rule version.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            id="note"
            label="Version Notes"
            placeholder="Describe what changes you made in this version"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={editedVersionNote}
            onChange={(e) => setEditedVersionNote(e.target.value)}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            onClick={handleSettingsDialogClose} 
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateVersionNote} 
            variant="contained"
            color="primary"
            disabled={!editedVersionNote.trim()}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
            }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add this dialog to your component JSX */}
      <Dialog
        open={ruleAiDialogOpen}
        onClose={handleRuleAiDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          style: { 
            borderRadius: '12px',
            overflow: 'hidden'
          } 
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#f5f7fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px'
        }}>
          <Box display="flex" alignItems="center">
            <Code sx={{ color: '#5569ff', marginRight: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Rule AI
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleRuleAiDialogClose}
            aria-label="close"
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '24px' }}>
          {/* Generated Rule Summary */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              AI-Generated Rule Summary
            </Typography>
            
            {generatingSummary ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                py: 3
              }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Analyzing rule structure and generating summary...
                </Typography>
              </Box>
            ) : ruleSummaryText ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid rgba(85, 105, 255, 0.2)',
                  bgcolor: 'rgba(85, 105, 255, 0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                  <Chip 
                    label="AI-generated" 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.65rem', 
                      bgcolor: 'rgba(85, 105, 255, 0.1)', 
                      color: '#5569ff',
                      fontWeight: 500
                    }} 
                  />
                </Box>
                
                <Typography variant="body1" sx={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7
                }}>
                  {ruleSummaryText}
                </Typography>
              </Paper>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Unable to generate summary. Please try again.
              </Typography>
            )}
          </Box>

          {/* Upcoming Features */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
            Upcoming Rule AI Features
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: '1px solid #e6f0ff',
                  height: '100%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(85, 105, 255, 0.1)', 
                    color: '#5569ff',
                    width: 40,
                    height: 40,
                    mr: 1.5
                  }}>
                    <Code fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Rule Optimization
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Automatically analyze rule flows to identify redundancies, circular paths, or dead ends.
                  Get suggestions for simplifying complex decision trees without changing their logic.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: '1px solid #e6f0ff',
                  height: '100%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(0, 171, 85, 0.1)', 
                    color: '#00ab55',
                    width: 40,
                    height: 40,
                    mr: 1.5
                  }}>
                    <Timeline fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Path Analysis
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Analyze the most common paths through your rule based on real-world data.
                  Identify edge cases and understand how frequently each decision branch is traversed.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: '1px solid #e6f0ff',
                  height: '100%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255, 193, 7, 0.1)', 
                    color: '#ffc107',
                    width: 40,
                    height: 40,
                    mr: 1.5
                  }}>
                    <Info fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Natural Language Generation
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Automatically generate human-readable documentation that explains rule logic in plain language.
                  Create business glossaries from your rules to maintain consistent terminology.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button 
            onClick={handleRuleAiDialogClose} 
            color="inherit"
            sx={{ borderRadius: '8px' }}
          >
            Close
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Info />}
            onClick={() => {
              handleRuleAiDialogClose();
              // Here you could navigate to a page about Rule AI features
            }}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              mr: 1
            }}
          >
            Learn More
          </Button>
          <Button 
            variant="contained"
            color="primary"
            startIcon={<Add />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
            }}
            onClick={handleRuleAiDialogClose}
          >
            Get Access
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Wrap the Whiteboard component with ReactFlowProvider
const WhiteboardWrapper: React.FC<WhiteboardProps> = ({ onClose }) => (
  <ReactFlowProvider>
    <Whiteboard onClose={onClose} />
  </ReactFlowProvider>
);

export default WhiteboardWrapper;
