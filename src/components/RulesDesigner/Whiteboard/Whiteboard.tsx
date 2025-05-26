import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  Position,
  ConnectionLineType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Paper, Typography, Box, IconButton, Tooltip, Chip, Divider,
  AppBar, Toolbar, Card, CardContent, CircularProgress, Grid,
  InputAdornment, Checkbox, Snackbar, Alert, Badge, Avatar,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer
} from '@mui/material';
import {
  Close, Code, Add, Remove, Timeline,
  Settings, Info, Save, CallSplit, Lock,
  Error as ErrorIcon, SystemUpdateAlt,
  CheckCircle, PlayArrow, Edit, KeyboardArrowLeft, KeyboardArrowRight
} from '@mui/icons-material';
import CircleNode from './CircleNode';
import DiamondNode from './DiamondNode';
import SupportModal from '../../SupportModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  updateRule, 
  setActiveRule, 
  setActiveVersion 
} from '@/store/rulesSlice';
import './css/Whiteboard.css';

// Node types for the ReactFlow component
const nodeTypes = {
  circle: CircleNode,
  diamond: DiamondNode,
};

interface WhiteboardProps {
  onClose?: () => void;
  onNeedHelp?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
  showTopNav?: boolean;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ onClose, onNeedHelp, onUnsavedChanges, showTopNav = true }) => {
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
  
  // Add new states for node editing
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeLabelValue, setNodeLabelValue] = useState('');
  
  // Add state for sidebar collapse
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportModalSubject, setSupportModalSubject] = useState('');
  const dispatch = useDispatch();

  // Add these state variables to your component
  const [ruleAiDialogOpen, setRuleAiDialogOpen] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [ruleSummaryText, setRuleSummaryText] = useState<string | null>(null);

  // Add new state for numeric editing and node deletion
  const [isNumericEditMode, setIsNumericEditMode] = useState(false);
  const [originalNodeLabel, setOriginalNodeLabel] = useState('');


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
      
      // Call the onUnsavedChanges callback if provided
      if (onUnsavedChanges) {
        onUnsavedChanges(hasChanges);
      }
    };
    
    // Use a timeout to avoid excessive checking during rapid changes
    const changeTimer = setTimeout(checkForChanges, 500);
    
    return () => clearTimeout(changeTimer);
  }, [nodes, edges, activeVersion, onUnsavedChanges]);

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
    // Open the SupportModal directly within Whiteboard
    setSupportModalOpen(true);
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
    console.log('Edge dialog closed');
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
    console.log('Save dialog closed');
  };

  const determineOutcome = (result) => {
    let riskFactors = [];
    let a1c = null;
    let bmi = null;
    let ahi = null;
    let systolic = null;
    let diastolic = null;
    let brca = false;
    let cpapCompliant = true;
    const ruleName = activeRule.name.toLowerCase();


    // Parse the result string
    const parts = result.split(', ');
    parts.forEach(part => {
        if (part.startsWith('A1c:')) {
            a1c = parseFloat(part.split(': ')[1].replace('%', ''));
        } else if (part.startsWith('BMI:')) {
            bmi = parseFloat(part.split(': ')[1]);
        } else if (part.startsWith('Sleep Apnea: AHI')) {
            const ahiString = part.split(': ')[1];
            if (ahiString.includes('>')) {
                ahi = parseFloat(ahiString.replace('AHI > ', ''));
            } else if (ahiString.includes('-')) {
                const range = ahiString.replace('AHI ', '').split('-');
                ahi = (parseFloat(range[0]) + parseFloat(range[1])) / 2; // Average of range
            }
        } else if (part.startsWith('Blood Pressure:')) {
            const bp = part.split(': ')[1].split('/');
            systolic = parseFloat(bp[0]);
            diastolic = parseFloat(bp[1]);
        } else if (part.startsWith('BRCA:')) {
            brca = part.split(': ')[1] === 'Positive';
        } else if (part.startsWith('No CPAP Compliance')) {
          cpapCompliant = false;
        }

    });

    // Evaluate risk factors based on parsed values
    if (a1c !== null && a1c > 7.0 ) { //&& ruleName === 'Diabetes Type 2' Diabetes is part of the default program
        riskFactors.push('Elevated A1c');
    }
    if (bmi !== null && bmi > 30.0) {
        riskFactors.push('Elevated BMI');
    }
    if (ahi !== null && ahi > 30.0 && ruleName === 'obstructive sleep apnea') {
        riskFactors.push('Severe Sleep Apnea');
    }
    if (systolic !== null && diastolic !== null && (systolic >= 140 || diastolic >= 90) && ruleName === 'hypertension risk assessment') {
        riskFactors.push('Elevated Blood Pressure');
    }
    if (brca && ruleName === 'brca risk assessment') {
        riskFactors.push('BRCA Positive');
    }
    if (ahi !== null && ahi > 30 && !cpapCompliant && ruleName === 'obstructive sleep apnea'){
      riskFactors.push('Severe Sleep Apnea Non Compliant')
    }

    // Determine outcome based on risk factors
    if (riskFactors.length > 2) {
        return 'rejected'; // High risk: Multiple significant factors
    } else if (riskFactors.length == 2) {
        return 'referred'; // Medium risk: Two significant factors
    } else if (riskFactors.includes('BRCA Positive')) {
        return 'referred'; // BRCA positive is a strong risk even alone
    } else if (riskFactors.includes('Elevated Blood Pressure')){
        return 'referred';
    } else {
        return 'approved'; // Low risk: Minimal or no significant factors
    }
};

  // Add this function to handle the test button click
  const handleTestRuleClick = () => {
    setTestDialogOpen(true);
    setTestingInProgress(true);

    // Simulate rule testing with sample data
    setTimeout(() => {
      // Generate mock test results
      const cases = [
        {
          id: 'CASE-2023-0001',
          name: 'John Smith',
          result: 'A1c: 6.1%, BMI: 22.5, Sleep Apnea: AHI > 30, Blood Pressure: 140/90, BRCA: Negative',
          outcome: determineOutcome('A1c: 6.1%, BMI: 22.5, Sleep Apnea: AHI > 30, Blood Pressure: 140/90, BRCA: Negative') as 'approved' | 'rejected' | 'referred',
          processingTime: Math.floor((300 + Math.random() * 180) / 60), // 5-8 minutes,
          risk: 'medium' as const,
        },
        {
          id: 'CASE-2023-0002',
          name: 'Emma Johnson',
          result: 'A1c: 5.5%, BMI: 24.3, No Sleep Apnea, Blood Pressure: 120/80, BRCA: Positive',
          outcome: determineOutcome('A1c: 5.5%, BMI: 24.3, No Sleep Apnea, Blood Pressure: 120/80, BRCA: Positive') as 'approved' | 'rejected' | 'referred',
          processingTime: Math.floor((300 + Math.random() * 180) / 60), // 5-8 minutes,
          risk: 'low' as const,
        },
        {
          id: 'CASE-2023-0003',
          name: 'Michael Brown',
          result: 'A1c: 8.1%, BMI: 35.2, Sleep Apnea: AHI > 30, No CPAP Compliance, Blood Pressure: 120/75, BRCA: Negative',
          outcome: determineOutcome('A1c: 8.1%, BMI: 35.2, Sleep Apnea: AHI > 30, No CPAP Compliance, Blood Pressure: 120/75, BRCA: Negative') as 'approved' | 'rejected' | 'referred',
          processingTime: Math.floor((300 + Math.random() * 180) / 60), // 5-8 minutes,
          risk: 'high' as const,
        },
        {
          id: 'CASE-2023-0004',
          name: 'Sarah Williams',
          result: 'A1c: 6.2%, BMI: 27.8, Sleep Apnea: AHI 5-15, CPAP Compliant, Blood Pressure: 130/85, BRCA: Positive',
          outcome: determineOutcome('A1c: 6.2%, BMI: 27.8, Sleep Apnea: AHI 5-15, CPAP Compliant, Blood Pressure: 130/85, BRCA: Positive') as 'approved' | 'rejected' | 'referred',
          processingTime: Math.floor((300 + Math.random() * 180) / 60), // 5-8 minutes,
          risk: 'medium' as const,
        },
        {
          id: 'CASE-2023-0005',
          name: 'David Miller',
          result: 'A1c: 9.3%, BMI: 36.7, Sleep Apnea: AHI > 30, Blood Pressure: 160/100, BRCA: Positive',
          outcome: determineOutcome('A1c: 9.3%, BMI: 36.7, Sleep Apnea: AHI > 30, Blood Pressure: 160/100, BRCA: Positive') as 'approved' | 'rejected' | 'referred',
          processingTime: Math.floor((300 + Math.random() * 180) / 60), // 5-8 minutes,
          risk: 'high' as const,
        }
      ];

      const totalApproved = cases.filter(c => c.outcome === 'approved').length;
      const totalCases = cases.length;
      const avgProcessingTime = cases.reduce((sum, c) => sum + c.processingTime, 0) / totalCases;

      const results = {
        overall: {
          stp: Math.floor((totalApproved / totalCases) * 100), // Calculate STP as percentage
          accuracy: Math.floor(90 + Math.random() * 9), // 90-99%
          resourceUtilization: Math.floor(60 + Math.random() * 30), // 60-90%
          averageProcessingTime: Math.ceil(avgProcessingTime), // Average processing time in minutes
        },
        cases
      };

      setTestResults(results);
      setTestingInProgress(false);
    }, 2000); // 2 second delay to simulate processing
  };

  // Add this function to handle dialog close
  const handleTestDialogClose = () => {
    setTestDialogOpen(false);
    setTestResults(null);
    console.log('Test dialog closed');
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
    setEditedVersionNote(''); // Clear form data
    console.log('Settings dialog closed');
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
    console.log('Rule AI dialog closed');
  };

  // Add this function to get field mapping information based on node type and label
  const getFieldMappingInfo = (node) => {
    if (!node) return null;
    
    // Default mapping info
    let mappingInfo = {
      field: '',
      description: 'Maps to a custom field in your dataset',
      dataType: 'string'
    };
    
    const label = node.data?.label?.toLowerCase() || '';
    const nodeType = node.type || '';
    
    // Determine mapping based on node type and label content
    if (nodeType === 'diamond') {
      // Decision nodes
      if (label.includes('diabetes') || label.includes('a1c')) {
        mappingInfo = {
          field: 'patient.conditions.diabetes',
          description: 'Maps to diabetes diagnostic data including A1c values',
          dataType: 'numeric (percentage)'
        };
      } else if (label.includes('bmi')) {
        mappingInfo = {
          field: 'patient.vitals.bmi',
          description: 'Maps to Body Mass Index calculation',
          dataType: 'numeric'
        };
      } else if (label.includes('sleep') || label.includes('apnea')) {
        mappingInfo = {
          field: 'patient.conditions.sleepApnea',
          description: 'Maps to sleep apnea diagnostic data including AHI values',
          dataType: 'numeric and categorical'
        };
      } else if (label.includes('risk')) {
        mappingInfo = {
          field: 'assessments.riskScore',
          description: 'Maps to calculated risk assessment scores',
          dataType: 'numeric or categorical'
        };
      }
    } else if (nodeType === 'circle') {
      // Terminal nodes
      if (label === 'start') {
        mappingInfo = {
          field: 'system.entryPoint',
          description: 'Initial process entry point',
          dataType: 'system'
        };
      } else if (label === 'end') {
        mappingInfo = {
          field: 'outcome.decision',
          description: 'Final decision outcome',
          dataType: 'categorical'
        };
      }
    } else {
      // Action nodes
      if (label.includes('refer') || label.includes('referral')) {
        mappingInfo = {
          field: 'actions.referral',
          description: 'Maps to referral actions in your process',
          dataType: 'action'
        };
      } else if (label.includes('approve') || label.includes('approval')) {
        mappingInfo = {
          field: 'actions.approval',
          description: 'Maps to approval actions in your process',
          dataType: 'action'
        };
      } else if (label.includes('reject') || label.includes('denial')) {
        mappingInfo = {
          field: 'actions.denial',
          description: 'Maps to rejection actions in your process',
          dataType: 'action'
        };
      }
    }
    
    return mappingInfo;
  };

  // Add a new handler for node clicks
  const handleNodeClick = (event, node) => {
    event.stopPropagation();
    setSelectedNode(node);
    
    // Store the original label for potential numeric editing
    const nodeLabel = node.data?.label || '';
    setOriginalNodeLabel(nodeLabel);
    
    // Reset edit modes
    setIsNumericEditMode(false);
    
    // Check if the label contains numbers we might want to edit separately
    const hasNumbers = /\d+(\.\d+)?/.test(nodeLabel);
    
    setNodeLabelValue(nodeLabel);
    setNodeDialogOpen(true);
  };

  // Add function to close the node dialog
  const handleNodeDialogClose = () => {
    setNodeDialogOpen(false);
    setSelectedNode(null);
    setNodeLabelValue('');
    setIsNumericEditMode(false);
    setOriginalNodeLabel('');
    console.log('Node dialog closed');
  };

  // Add function to toggle numeric edit mode
  const toggleNumericEditMode = () => {
    setIsNumericEditMode(!isNumericEditMode);
  };

  // Add a function to extract and update only numbers in a string
  const extractAndUpdateNumbers = (original, value) => {
    
    // Otherwise use the original behavior
    // Extract numbers from both strings
    const originalNumbers = original.match(/\d+(\.\d+)?/g) || [];
    const newNumbers = value.match(/\d+(\.\d+)?/g) || [];
    
    // If we don't have any numbers in either string, just return the new value
    if (originalNumbers.length === 0 || newNumbers.length === 0) {
      return value;
    }
    
    // Replace numbers in the original string with new numbers
    let result = original;
    const minLength = Math.min(originalNumbers.length, newNumbers.length);
    
    for (let i = 0; i < minLength; i++) {
      result = result.replace(originalNumbers[i], newNumbers[i]);
    }
    
    return result;
  };

  // Update the node label update function to handle threshold-only edits
  const handleNodeLabelSubmit = () => {
    if (!selectedNode) return;
    
    let finalLabel;
    
    // Determine the final label based on edit mode
    if (isNumericEditMode) {
      // We're in numeric-only edit mode (but without condition separation)
      finalLabel = extractAndUpdateNumbers(originalNodeLabel, nodeLabelValue);
    } else {
      // Standard edit mode
      finalLabel = nodeLabelValue;
    }
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                label: finalLabel
              } 
            } 
          : node
      )
    );
    
    handleNodeDialogClose();
  };

  // Add function to delete a node
  const handleNodeDelete = () => {
    if (!selectedNode) return;
    
    // Remove the node from the graph
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    
    // Also remove any connected edges
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
    ));
    
    // Update statistics
    setRuleSummary(prev => {
      const updatedStats = { ...prev, nodeCount: prev.nodeCount - 1 };
      
      if (selectedNode.type === 'diamond') {
        updatedStats.decisionPoints = prev.decisionPoints - 1;
      }
      
      if (
        selectedNode.data?.label === 'End' || 
        selectedNode.type === 'circle' && selectedNode.id !== 'start'
      ) {
        updatedStats.endpoints = prev.endpoints - 1;
      }
      
      return updatedStats;
    });
    
    handleNodeDialogClose();
  };

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Add a function to arrange nodes in a vertical layout
  const applyVerticalLayout = useCallback(() => {
    if (!nodes.length) return;
    
    // Find start and end nodes
    const startNode = nodes.find(node => node.id === 'start' || node.data?.label === 'Start');
    
    // Group nodes by their conceptual "level" in the flow
    const levels: { [key: string]: any[] } = {};
    const processed = new Set<string>();
    
    // Start with the start node as level 0
    if (startNode) {
      levels['0'] = [startNode];
      processed.add(startNode.id);
    }
    
    // Function to find all direct sources of a node
    const findSources = (nodeId: string) => {
      return edges
        .filter(edge => edge.target === nodeId)
        .map(edge => edge.source);
    };
    
    // Reverse breadth-first traversal to assign levels
    let currentLevel = 0;
    while (Object.keys(levels).includes(currentLevel.toString())) {
      const nextLevel = currentLevel + 1;
      levels[nextLevel.toString()] = [];
      
      // For each node in the current level, find its sources
      for (const node of levels[currentLevel.toString()]) {
        const sources = findSources(node.id);
        
        for (const sourceId of sources) {
          if (!processed.has(sourceId)) {
            const sourceNode = nodes.find(n => n.id === sourceId);
            if (sourceNode) {
              levels[nextLevel.toString()].push(sourceNode);
              processed.add(sourceId);
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
    
    // Position nodes vertically by level
    const xGap = 150; // horizontal gap between levels
    const yGap = 100; // vertical gap between nodes in the same level
    const updatedNodes = [...nodes];
    
    // Update positions for each node based on its level
    Object.keys(levels).forEach((level) => {
      const levelNodes = levels[level];
      const levelY = parseInt(level) * yGap + 100; // Y position based on level
      
      levelNodes.forEach((node, index) => {
        // Calculate X position to center the nodes in each level
        const levelWidth = levelNodes.length * xGap;
        const startX = 100 + (800 - levelWidth) / 2;
        const nodeX = startX + index * xGap;
        
        // Find and update the node in our updatedNodes array
        const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
        if (nodeIndex !== -1) {
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            position: { x: nodeX, y: levelY }
          };
        }
      });
    });
    
    // Handle any nodes not placed (not connected to the main flow)
    const unplacedNodes = updatedNodes.filter(node => !processed.has(node.id));
    if (unplacedNodes.length > 0) {
      // Position these at the bottom
      const maxLevel = Math.max(...Object.keys(levels).map(l => parseInt(l)), 0);
      const extraY = (maxLevel + 1) * yGap + 100;
      
      unplacedNodes.forEach((node, index) => {
        const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
        if (nodeIndex !== -1) {
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            position: { x: 100 + index * xGap, y: extraY }
          };
        }
      });
    }
    
    setNodes(updatedNodes);
  }, [nodes, edges, setNodes]);

  return (
    <Box className="whiteboard-container">
      {/* Header */}
      {showTopNav && (
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
                Analyze
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
      )}
      
      <Box className="whiteboard-content">
        {/* Retractable Side panel */}
        <Paper 
          className="whiteboard-side-panel"
          sx={{ 
            width: sidebarOpen ? 280 : 48,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            position: 'relative',
            maxHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Sidebar toggle button */}
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            {sidebarOpen ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>

          {sidebarOpen && (
            <Box sx={{ 
              p: 2, 
              pt: 6, 
              overflowY: 'auto',
              flexGrow: 1,
              maxHeight: 'calc(100vh - 120px)'
            }}>
              <Typography variant="subtitle2" className="side-panel-header">
                Add Elements
              </Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <Box className="side-panel-buttons">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => addCircle('Start')}
                  startIcon={<CheckCircle />}
                  className="side-panel-btn"
                  fullWidth
                  sx={{ mb: 1 }}
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
                  sx={{ mb: 1 }}
                >
                  End Node
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={addDiamond}
                  startIcon={<CallSplit />}
                  className="side-panel-btn"
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Decision Node
                </Button>
                
                <Button 
                  variant="outlined" 
                  onClick={addRectangle}
                  startIcon={<SystemUpdateAlt />}
                  className="side-panel-btn"
                  fullWidth
                  sx={{ mb: 1 }}
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
                  sx={{ mb: 2 }}
                >
                  Remove Last
                </Button>
              </Box>
              
              
              <Box className="side-panel-rule-info">
                <Typography variant="subtitle2" className="side-panel-header">
                  Rule Information
                </Typography>
                  
                <Box className="rule-info-content">
                  {/* Rule Name and Version */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                      {activeRule.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip 
                        label={`Version ${activeVersion.version}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      {activeVersion.tag && (
                        <Chip 
                          label={activeVersion.tag}
                          size="small"
                          color="success"
                          variant="filled"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Rule Status */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: hasUnsavedChanges ? '#ff9800' : '#4caf50' 
                      }} />
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {hasUnsavedChanges ? 'Modified' : 'Saved'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Creation and Modified Dates */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Created
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>

                  {/* Rule Complexity */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Complexity
                    </Typography>
                    {(() => {
                      const complexity = nodes.length + edges.length;
                      let level = 'Simple';
                      let color = '#4caf50';
                      
                      if (complexity > 20) {
                        level = 'Complex';
                        color = '#ff9800';
                      } else if (complexity > 10) {
                        level = 'Moderate';
                        color = '#2196f3';
                      }
                      
                      return (
                        <Chip 
                          label={level}
                          size="small"
                          sx={{ 
                            height: 20, 
                            fontSize: '0.7rem',
                            bgcolor: `${color}20`,
                            color: color,
                            border: `1px solid ${color}40`
                          }}
                        />
                      );
                    })()}
                  </Box>

                  {/* Version Notes */}
                  {activeVersion.note && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Version Notes
                      </Typography>
                      <Paper sx={{ 
                        p: 1, 
                        bgcolor: 'rgba(85, 105, 255, 0.05)',
                        border: '1px solid rgba(85, 105, 255, 0.1)',
                        borderRadius: 1
                      }}>
                        <Typography variant="body2" sx={{ 
                          fontSize: '0.75rem',
                          fontStyle: 'italic',
                          color: 'text.secondary'
                        }}>
                          {activeVersion.note}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Rule Metrics (if available) */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Performance (Last Test)
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0.3 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>STP Rate:</strong> {testResults?.overall?.stp || '--'}%
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>Accuracy:</strong> {testResults?.overall?.accuracy || '--'}%
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        <strong>Avg. Time:</strong> {testResults?.overall?.averageProcessingTime || '--'} min
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #f0f0f0' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleSettingsDialogOpen}
                      startIcon={<Settings />}
                      fullWidth
                      sx={{ 
                        mb: 1,
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        height: 28
                      }}
                    >
                      Rule Settings
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleRuleAiClick}
                      startIcon={<Code />}
                      fullWidth
                      sx={{ 
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        height: 28
                      }}
                    >
                      Analyze with AI
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {!sidebarOpen && (
            <Box sx={{ p: 1, pt: 6, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Tooltip title="Start Node" placement="right">
                <IconButton 
                  onClick={() => addCircle('Start')}
                  color="primary"
                  size="small"
                >
                  <CheckCircle />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="End Node" placement="right">
                <IconButton 
                  onClick={() => addCircle('End')}
                  color="error"
                  size="small"
                >
                  <ErrorIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Decision Node" placement="right">
                <IconButton 
                  onClick={addDiamond}
                  size="small"
                >
                  <CallSplit />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Action Node" placement="right">
                <IconButton 
                  onClick={addRectangle}
                  size="small"
                >
                  <SystemUpdateAlt />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Remove Last" placement="right">
                <IconButton 
                  onClick={removeNode}
                  color="warning"
                  size="small"
                  disabled={nodes.length === 0}
                >
                  <Remove />
                </IconButton>
              </Tooltip>
            </Box>
          )}
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
            onNodeClick={handleNodeClick} // Add this line to handle node clicks
            onEdgeClick={handleEdgeClick}
            fitView
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { strokeWidth: 3 },
              labelStyle: { 
                fill: '#1a3353', 
                fontWeight: 50, 
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
            connectionLineType={ConnectionLineType.SmoothStep}
            connectionLineStyle={{ stroke: '#5c6bc0', strokeWidth: 3, strokeDasharray: '5,3' }}
            snapToGrid={true}
            snapGrid={[20, 20]} // Align to a 20px grid
            className="reactflow-wrapper"
          >
            <MiniMap 
              nodeStrokeColor={(n) => n.style?.stroke || '#42a5f5'}
              nodeColor={(n) => (n.style?.background as string) || '#fff'} 
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
      {/* Edge Dialog */}
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
          <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
            <Typography component="div" variant="caption" color="text.secondary">
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
      
      {/* Node Dialog - Update with data mapping information */}
      <Dialog 
        open={nodeDialogOpen} 
        onClose={handleNodeDialogClose}
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
            <Edit sx={{ color: '#5569ff', marginRight: 1.5 }} />
            <Typography variant="h6" fontWeight={600}>
              Edit Node
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleNodeDialogClose}
            aria-label="close"
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>          
          <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isNumericEditMode 
                ? "Edit only the numeric values in this node's label." 
                : "Edit the label for this node. This text will be displayed inside the node."}
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label={isNumericEditMode ? "Numeric Values" : "Node Label"}
            type="text"
            fullWidth
            value={nodeLabelValue}
            onChange={(e) => setNodeLabelValue(e.target.value)}
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
                  {selectedNode?.type === 'diamond' ? (
                    <CallSplit fontSize="small" />
                  ) : selectedNode?.data?.label === 'Start' || selectedNode?.data?.label === 'End' ? (
                    selectedNode.data.label === 'Start' ? (
                      <CheckCircle fontSize="small" />
                    ) : (
                      <ErrorIcon fontSize="small" />
                    )
                  ) : (
                    <SystemUpdateAlt fontSize="small" />
                  )}
                </Box>
              ),
            }}
            helperText={isNumericEditMode ? "Only numeric values will be updated" : ""}
          />
          
          {/\d/.test(originalNodeLabel) && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Checkbox
                checked={isNumericEditMode}
                onChange={toggleNumericEditMode}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Edit only numeric values
              </Typography>
            </Box>
          )}
          
          {/* Data Mapping Information - made to look like a locked feature */}
          {selectedNode && (
            <Box 
              sx={{ 
                mt: 2,
                mb: 2,
                p: 2, 
                borderRadius: 2,
                border: '1px solid rgba(25, 118, 210, 0.2)',
                bgcolor: 'rgba(232, 244, 253, 0.4)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Add overlay to make it appear locked */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  backdropFilter: 'blur(1px)',
                }}
              >
                <Button 
                  variant="contained"
                  color="primary"
                  startIcon={<Lock />}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
                  }}
                  onClick={() => window.location.href = "mailto:mqazi@munichre.com?subject=alitheia Labs Support | Get Access to Data Mapping"}
                >
                  Get Access
                </Button>
              </Box>
              
              {/* Background content (locked) */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Data Field Mapping
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {getFieldMappingInfo(selectedNode)?.field || 'patient.data.field'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getFieldMappingInfo(selectedNode)?.description || 'Maps to your data source'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          padding: '16px 24px', 
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={handleNodeDelete}
            color="error"
            startIcon={<Remove />}
            sx={{ borderRadius: '8px' }}
          >
            Delete Node
          </Button>
          <Box>
            <Button 
              onClick={handleNodeDialogClose} 
              color="inherit"
              sx={{ borderRadius: '8px', mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleNodeLabelSubmit} 
              variant="contained"
              color="primary"
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
              }}
            >
              Save Changes
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Save Version Dialog */}
      <Dialog
        open={saveVersionDialogOpen}
        onClose={handleSaveDialogClose}
        PaperProps={{ 
          style: { 
            borderRadius: '12px',
            maxWidth: '500px'
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
              Save New Version
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
          <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new version of this rule with your current changes.
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
            <Info fontSize="small" sx={{ color: '#ffc107', marginRight: 1 }} />
            <Typography component="div" variant="caption" color="text.secondary">
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
          {newVersion ? 
            `Version ${newVersion} saved successfully! (Changes will be lost on refresh)` : 
            'Your request has been submitted. We\'ll be in touch soon!'}
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
                            min
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
                        <TableCell>{caseItem.processingTime} min</TableCell>
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
              startIcon={<Lock />}
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
            startIcon={<Add />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
            }}
            onClick={() => window.location.href = "mailto:mqazi@munichre.com?subject=alitheia Labs Support | Get Access to Business Impact Metrics"}
            >
            Get Access
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
          <Typography component="div" variant="body2" color="text.secondary" sx={{ mb: 3 }}>
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
              Analyze
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
            variant="contained"
            color="primary"
            startIcon={<Add />}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 105, 255, 0.15)',
            }}
            onClick={() => window.location.href = "mailto:mqazi@munichre.com?subject=alitheia Labs Support | Get Access to Rule AI"}
            >
            Get Access
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add the SupportModal component */}
      <SupportModal 
        open={supportModalOpen} 
        onClose={() => setSupportModalOpen(false)} 
        defaultSubject={supportModalSubject}
      />
    </Box>
  );
};

// Wrap the Whiteboard component with ReactFlowProvider
const WhiteboardWrapper: React.FC<WhiteboardProps> = ({ onClose, onNeedHelp }) => (
  <ReactFlowProvider>
    <Whiteboard onClose={onClose} onNeedHelp={onNeedHelp} />
  </ReactFlowProvider>
);

export default WhiteboardWrapper;
