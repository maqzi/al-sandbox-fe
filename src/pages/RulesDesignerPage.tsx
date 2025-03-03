import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Layout } from '@/components/Layout';
import RulesDesignerComponent from "@/components/RulesDesignerComponent";

const diabetesNodes = [
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

const diabetesEdges = [
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

const diabetesEdgesV2 = diabetesEdges.map(edge => 
    edge.id === 'e9-11' ? { ...edge, label: '<=7' } : edge
);

const rules = [
  {
    id: '1',
    name: 'Diabetes Type 2',
    versions: [
      { version: 'v1', nodes: diabetesNodes, edges: diabetesEdges, tag: 'latest', note: 'Updated A1c threshold to 8' },
      { version: 'v2', nodes: diabetesNodes, edges: diabetesEdgesV2, tag: '', note: '' },
    ],
  },
  { id: '2', name: 'Obstructive Sleep Apnea' },
  { id: '3', name: 'Hypertension' },
// Add more rules as needed
];

const RulesDesignerPage = ({ handleStepChange }) => {
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleRuleClick = (rule) => {
    const latestVersion = rule.versions.find(version => version.tag === 'latest') || rule.versions[0];
    setSelectedRule(rule);
    setSelectedVersion(latestVersion);
  };

  const handleHistoryClick = (rule) => {
    setSelectedRule(rule);
    setHistoryDialogOpen(true);
  };

  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
    setHistoryDialogOpen(false);
  };

  const lockedRules = rules.filter(rule => !rule.versions || rule.versions.length === 0).map(rule => rule.name);

  if (selectedRule && selectedVersion) {
    return (
      <RulesDesignerComponent
        handleStepChange={handleStepChange}
        nodes={selectedVersion.nodes}
        edges={selectedVersion.edges}
        onVersionSelect={handleVersionSelect}
        rule={selectedRule}
      />
    );
  }

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rule ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rule Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} style={{ cursor: 'pointer' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{rule.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {lockedRules.includes(rule.name) && (
                  <img src="/lock.svg" alt="locked" style={{ marginLeft: '0px', width: '16px', height: '16px', verticalAlign: 'middle' }} />
                )}
                {rule.name}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {!lockedRules.includes(rule.name) ? (
                  <>
                    <span
                      role="img"
                      aria-label="modify"
                      style={{ marginRight: '8px', cursor: 'pointer' }}
                      onClick={() => handleRuleClick(rule)}
                    >
                      ✏️
                    </span>
                    <span
                      role="img"
                      aria-label="history"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleHistoryClick(rule)}
                    >
                      📜
                    </span>
                  </>
                ) : (
                  <span style={{ color: '#888' }}>Locked</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={historyDialogOpen} onClose={() => setHistoryDialogOpen(false)}>
        <DialogTitle>Rule Versions</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Version</TableCell>
                <TableCell>Tag</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedRule?.versions.map((version) => (
                <TableRow key={version.version}>
                  <TableCell>{version.version}</TableCell>
                  <TableCell>{version.tag}</TableCell>
                  <TableCell>{version.note}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleVersionSelect(version)}>Select</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RulesDesignerPage;