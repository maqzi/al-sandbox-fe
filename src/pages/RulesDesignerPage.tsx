import {
  Lock,
  PlayArrow,
  CheckCircle,
  History,
  Close,
  Add,
  Star,
  FilterList,
} from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Chip,
  Paper,
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CreateRuleDialog from '@/components/RulesDesigner/CreateRuleDialog';
import datadog from '@/lib/datadog';
import {
  Rule,
  RuleVersion,
  setActiveRule,
  setActiveVersion,
  updateRuleActiveVersion,
} from '@/store/rulesSlice';
import { RootState } from '@/store/store';

const RulesDesignerPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rules = useSelector((state: RootState) => state.rules.rules as Rule[]);

  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [createRuleDialogOpen, setCreateRuleDialogOpen] = useState(false);

  // Log page view on component mount
  useEffect(() => {
    datadog.logPageView('rules_designer', {});
  }, []);

  // Set the selected rule at component mount
  useEffect(() => {
    if (rules.length > 0) {
      const firstRule = rules[0];
      setSelectedRule(firstRule);
    }
  }, [rules]);

  // Memoize handlers with useCallback to prevent unnecessary re-renders
  const handleRuleClick = useCallback((rule: Rule) => {
    setSelectedRule(rule);
  }, []);

  const handleHistoryClick = useCallback((rule: Rule, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRule(rule);
    setHistoryDialogOpen(true);
  }, []);

  const handleVersionSelect = useCallback(
    (rule: Rule, version: RuleVersion) => {
      // Update the active version in Redux state
      dispatch(
        updateRuleActiveVersion({ ruleId: rule.id, versionId: version.version })
      );
      setHistoryDialogOpen(false);
    },
    [dispatch]
  );

  const handlePlayClick = useCallback(
    (rule: Rule) => {
      // Find the active version for this rule
      const activeVersion =
        rule.versions.find(v => v.version === rule.activeVersionId) ||
        rule.versions.find(v => v.tag === 'latest') ||
        (rule.versions.length > 0 ? rule.versions[0] : null);

      if (activeVersion) {
        dispatch(setActiveRule(rule));
        dispatch(setActiveVersion(activeVersion));
        // Navigate to dedicated whiteboard page with version
        navigate(
          `/rules/${rule.id}/version/${activeVersion.version}/whiteboard`
        );
      }
    },
    [dispatch, navigate]
  );

  // Get active version for a rule
  const getActiveVersion = useCallback((rule: Rule): RuleVersion | null => {
    if (rule.activeVersionId) {
      return (
        rule.versions.find(v => v.version === rule.activeVersionId) || null
      );
    }

    // Fallback to latest version if no active version is set
    const latestVersion = rule.versions.find(v => v.tag === 'latest');
    return (
      latestVersion || (rule.versions.length > 0 ? rule.versions[0] : null)
    );
  }, []);

  // Computed values
  const lockedRuleNames = rules
    .filter(rule => !rule.versions || rule.versions.length === 0)
    .map(rule => rule.name);

  return (
    <Box
      className="p-4"
      sx={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}
    >
      <Card
        sx={{
          marginBottom: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 2,
            }}
          >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Rules Designer
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Filter rules">
                <IconButton>
                  <FilterList />
                </IconButton>
              </Tooltip>

              <Button
                onClick={() => setCreateRuleDialogOpen(true)}
                variant="contained"
                color="primary"
                startIcon={<Add />}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(85, 105, 255, 0.2)',
                }}
              >
                Create New Rule
              </Button>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: 3 }}
          >
            Design and manage rule trees for your program.
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: 'none',
              border: '1px solid #eaedf3',
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#f5f7fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Rule ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rule Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Active Version</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map(rule => {
                  const isLocked = lockedRuleNames.includes(rule.name);
                  const isSelected = selectedRule?.id === rule.id;
                  const activeRuleVersion = getActiveVersion(rule);

                  return (
                    <TableRow
                      key={rule.id}
                      sx={{
                        cursor: !isLocked ? 'pointer' : 'default',
                        '&:hover': !isLocked
                          ? { backgroundColor: '#f5f9ff' }
                          : {},
                        backgroundColor: isSelected
                          ? 'rgba(85, 105, 255, 0.04)'
                          : 'inherit',
                        borderLeft: isSelected
                          ? '4px solid #5569ff'
                          : '4px solid transparent',
                      }}
                      onClick={() => !isLocked && handleRuleClick(rule)}
                    >
                      <TableCell
                        sx={{ color: isLocked ? '#a0a5b9' : 'inherit' }}
                      >
                        {rule.id}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {isLocked ? (
                            <Tooltip title="This rule is locked">
                              <Lock
                                sx={{
                                  color: '#a0a5b9',
                                  marginRight: 1,
                                  fontSize: 20,
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Active rule">
                              <Star
                                sx={{
                                  color: '#ffc107',
                                  marginRight: 1,
                                  fontSize: 20,
                                }}
                              />
                            </Tooltip>
                          )}
                          <Typography
                            sx={{
                              fontWeight: isSelected ? 600 : 400,
                              color: isLocked ? '#a0a5b9' : 'inherit',
                            }}
                          >
                            {rule.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {activeRuleVersion ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip
                              label={activeRuleVersion.version}
                              size="small"
                              color={
                                activeRuleVersion.tag === 'latest'
                                  ? 'primary'
                                  : 'default'
                              }
                              sx={{
                                borderRadius: '4px',
                                marginRight: 1,
                                fontWeight: 500,
                              }}
                            />
                            <Tooltip title="View version history">
                              <IconButton
                                size="small"
                                onClick={e => handleHistoryClick(rule, e)}
                                sx={{
                                  color: '#5569ff',
                                  backgroundColor: 'rgba(85, 105, 255, 0.1)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(85, 105, 255, 0.2)',
                                  },
                                }}
                              >
                                <History fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Typography color="text.secondary" variant="body2">
                            No version available
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {!isLocked ? (
                          <Tooltip title="Open editor">
                            <IconButton
                              onClick={() => handlePlayClick(rule)}
                              sx={{
                                color: '#5569ff',
                                backgroundColor: 'rgba(85, 105, 255, 0.1)',
                                '&:hover': {
                                  backgroundColor: 'rgba(85, 105, 255, 0.2)',
                                },
                              }}
                            >
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Chip
                            label="Locked"
                            size="small"
                            variant="outlined"
                            sx={{
                              borderRadius: '4px',
                              color: '#a0a5b9',
                              borderColor: '#a0a5b9',
                            }}
                            icon={<Lock style={{ fontSize: 14 }} />}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No rules available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Version History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '8px',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#f5f7fa',
            borderRadius: '8px 8px 0 0',
            padding: '16px 24px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <History sx={{ marginRight: 1, color: '#5569ff' }} />
            <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
              Rule Version History: {selectedRule?.name}
            </Typography>
          </Box>
          <Button
            onClick={() => setHistoryDialogOpen(false)}
            sx={{ minWidth: '36px', padding: '6px' }}
          >
            <Close />
          </Button>
        </DialogTitle>

        <DialogContent sx={{ padding: '24px' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: 2 }}
          >
            Select a version to work with or view its details.
          </Typography>

          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {selectedRule?.versions.map(version => {
              const isActiveVersion =
                selectedRule.activeVersionId === version.version;

              return (
                <Paper
                  key={version.version}
                  elevation={1}
                  sx={{
                    marginBottom: 2,
                    padding: 2,
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    border: isActiveVersion
                      ? '2px solid #5569ff'
                      : '1px solid #e0e0e0',
                    boxShadow: isActiveVersion
                      ? '0 0 0 2px rgba(85, 105, 255, 0.2)'
                      : 'none',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: isActiveVersion
                        ? '0 4px 8px rgba(85, 105, 255, 0.2)'
                        : '0 4px 8px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => handleVersionSelect(selectedRule, version)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="span"
                          sx={{ fontWeight: 600, marginRight: 1 }}
                        >
                          v{version.version}
                        </Typography>
                        {version.tag === 'latest' && (
                          <Chip
                            size="small"
                            label="Latest"
                            color="primary"
                            sx={{ height: '22px' }}
                          />
                        )}
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {version.note}
                      </Typography>

                      <Box sx={{ display: 'flex', marginTop: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ marginRight: 2 }}
                        >
                          Nodes: {version.nodes.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Edges: {version.edges.length}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant={isActiveVersion ? 'contained' : 'outlined'}
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        minWidth: '100px',
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        handleVersionSelect(selectedRule, version);
                      }}
                    >
                      {isActiveVersion ? (
                        <>
                          <CheckCircle
                            sx={{ marginRight: 0.5, fontSize: '16px' }}
                          />
                          Selected
                        </>
                      ) : (
                        'Select'
                      )}
                    </Button>
                  </Box>
                </Paper>
              );
            })}

            {selectedRule?.versions.length === 0 && (
              <Typography
                variant="body1"
                align="center"
                sx={{ padding: 3, color: 'text.secondary' }}
              >
                No versions available for this rule.
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}
        >
          <Button
            onClick={() => setHistoryDialogOpen(false)}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Rule Dialog */}
      <CreateRuleDialog
        open={createRuleDialogOpen}
        onClose={() => setCreateRuleDialogOpen(false)}
      />
    </Box>
  );
};

export default RulesDesignerPage;
