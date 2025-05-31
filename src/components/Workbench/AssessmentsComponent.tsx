import {
  Warning,
  CheckCircle,
  Info,
  Security,
  Assessment,
  AssignmentLate,
  ReportProblem,
  Spa,
  Gavel,
  HealthAndSafety,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  Badge,
  Tooltip,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectSelectedCase } from '@/store/selectors';

interface TableProps {
  data: Array<{
    rule: string;
    riskClass: string;
    mortalityRating: number | string;
    refer: string;
    decline: string;
    tobacco: string;
    flatExtraRating: number | string;
    targetOrder?: number | string;
    overrideReason?: string;
    overrideComment?: string;
  }>;
}

const AssessmentsComponent: React.FC = () => {
  const theme = useTheme();

  // Get data directly from Redux state
  const selectedCase = useSelector(selectSelectedCase);

  // Ensure we have case data
  if (!selectedCase) {
    return null;
  }

  // Extract the rule decisions from the selected case
  const carrierRuleDecisions =
    selectedCase.assessment.ruleDecisions?.carrier || [];
  const alitheiaAssessments =
    selectedCase.assessment.ruleDecisions?.alitheia || [];

  const referralAssessments = alitheiaAssessments.filter(
    a => a.refer?.toLowerCase() === 'yes'
  );

  const carrierReferrals = carrierRuleDecisions.filter(
    r => r.refer?.toLowerCase() === 'yes'
  );

  const hasReferrals =
    referralAssessments.length > 0 || carrierReferrals.length > 0;

  // Get risk class summary
  const bestRiskClass =
    alitheiaAssessments
      .filter(a => a.riskClass && !a.refer?.toLowerCase().includes('yes'))
      .map(a => a.riskClass)[0] || 'Standard';

  const riskIcons = {
    'Preferred Plus': <Spa color="success" />,
    Preferred: <Spa color="success" />,
    'Standard Plus': <HealthAndSafety color="info" />,
    'Standard NT': <HealthAndSafety color="info" />,
    Standard: <HealthAndSafety color="info" />,
    Referred: <ReportProblem color="warning" />,
  };

  const getRiskClassIcon = (riskClass: string) => {
    return riskIcons[riskClass] || <Assessment />;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Summary Section */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          background: 'linear-gradient(to right, #f5f7ff, #ffffff)',
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Security sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                Risk Assessment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Risk evaluation based on triggered policy rules
              </Typography>
            </Box>

            {hasReferrals ? (
              <Chip
                icon={<Warning />}
                label="Requires Review"
                color="warning"
                sx={{
                  fontWeight: 600,
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(255, 152, 0, 0.25)',
                }}
              />
            ) : (
              <Chip
                icon={<CheckCircle />}
                label="Auto-Approved"
                color="success"
                sx={{
                  fontWeight: 600,
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.25)',
                }}
              />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            {/* Summary Stats */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Best Risk Class
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  {getRiskClassIcon(hasReferrals ? 'Referred' : bestRiskClass)}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, textAlign: 'center' }}
                >
                  {hasReferrals ? 'Referred' : bestRiskClass}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Carrier Rules
                </Typography>
                <Badge
                  badgeContent={carrierRuleDecisions.length}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '1rem',
                      height: '24px',
                      minWidth: '24px',
                      borderRadius: '12px',
                    },
                  }}
                >
                  <Gavel
                    sx={{
                      fontSize: 32,
                      color: theme.palette.primary.main,
                      mb: 1,
                    }}
                  />
                </Badge>
                <Typography variant="body2">
                  {carrierRuleDecisions.filter(r => r.refer === 'Yes').length >
                  0
                    ? '1 referral needed'
                    : 'No referrals'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Alitheia Rules
                </Typography>
                <Badge
                  badgeContent={alitheiaAssessments.length}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '1rem',
                      height: '24px',
                      minWidth: '24px',
                      borderRadius: '12px',
                    },
                  }}
                >
                  <Assessment
                    sx={{
                      fontSize: 32,
                      color: theme.palette.primary.main,
                      mb: 1,
                    }}
                  />
                </Badge>
                <Typography variant="body2">
                  {referralAssessments.length > 0
                    ? `${referralAssessments.length} referrals needed`
                    : 'No referrals'}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {hasReferrals && (
            <Alert
              severity="warning"
              variant="outlined"
              icon={<AssignmentLate />}
              sx={{ mt: 3, borderRadius: 2 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Manual review required
              </Typography>
              <Typography variant="body2">
                {referralAssessments.length === 1
                  ? 'One rule requires human review. Please check the assessment tables below.'
                  : `${referralAssessments.length} rules require human review. Please check the assessment tables below.`}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Carrier Rules Section */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
            >
              <Gavel sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              Carrier Rule Decisions
            </Typography>
            <Chip
              label={`${carrierRuleDecisions.length} Rules`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 12 }}
            />
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <Table
              sx={{ minWidth: 650 }}
              aria-label="carrier rule decisions table"
              size="small"
            >
              <TableHead>
                <TableRow sx={{ bgcolor: '#f7f9fc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Rule</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Risk Class</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Mortality Rating
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Refer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Decline</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tobacco</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Flat Extra Rating
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {carrierRuleDecisions.length > 0 ? (
                  carrierRuleDecisions.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': { backgroundColor: '#f5f9ff' },
                        backgroundColor: row.refer
                          ?.toLowerCase()
                          .includes('yes')
                          ? 'rgba(255, 244, 229, 0.5)'
                          : 'inherit',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{row.rule}</TableCell>
                      <TableCell>{row.riskClass || '—'}</TableCell>
                      <TableCell>{row.mortalityRating || '—'}</TableCell>
                      <TableCell>
                        <StatusChip status={row.refer} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.decline} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.tobacco} />
                      </TableCell>
                      <TableCell>{row.flatExtraRating || '—'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Box
                        sx={{
                          color: 'text.secondary',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Info sx={{ mb: 1, fontSize: 36, opacity: 0.6 }} />
                        <Typography>
                          No carrier rule decisions available
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Alitheia Assessments Section */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}
            >
              <Assessment sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              alitheia Assessments
            </Typography>
            <Chip
              label={`${alitheiaAssessments.length} Rules`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 12 }}
            />
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <Table
              sx={{ minWidth: 650 }}
              aria-label="alitheia assessments table"
              size="small"
            >
              <TableHead>
                <TableRow sx={{ bgcolor: '#f7f9fc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Rule</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Risk Class</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Mortality Rating
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Refer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Decline</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tobacco</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Target Order</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Override</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alitheiaAssessments.length > 0 ? (
                  alitheiaAssessments.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': { backgroundColor: '#f5f9ff' },
                        backgroundColor: row.refer
                          ?.toLowerCase()
                          .includes('yes')
                          ? 'rgba(255, 244, 229, 0.5)'
                          : 'inherit',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{row.rule}</TableCell>
                      <TableCell>{row.riskClass || '—'}</TableCell>
                      <TableCell>{row.mortalityRating || '—'}</TableCell>
                      <TableCell>
                        <StatusChip status={row.refer} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.decline} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.tobacco} />
                      </TableCell>
                      <TableCell>{row.targetOrder || '—'}</TableCell>
                      <TableCell>
                        {row.overrideReason ? (
                          <Tooltip
                            title={`Reason: ${row.overrideReason}${row.overrideComment ? `\nComment: ${row.overrideComment}` : ''}`}
                          >
                            <Chip
                              label="View Details"
                              size="small"
                              color="info"
                              variant="outlined"
                              sx={{ borderRadius: 1 }}
                            />
                          </Tooltip>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Box
                        sx={{
                          color: 'text.secondary',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Info sx={{ mb: 1, fontSize: 36, opacity: 0.6 }} />
                        <Typography>
                          No alitheia assessments available
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

// Helper function to render status chips
const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  if (!status) return <span>—</span>;

  if (
    status.toLowerCase() === 'yes' ||
    status.toLowerCase() === 'yes - override'
  ) {
    return (
      <Chip
        label={status}
        size="small"
        color="error"
        icon={<Warning fontSize="small" />}
        sx={{
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 500,
          '& .MuiChip-icon': { fontSize: '0.875rem' },
        }}
      />
    );
  }

  if (status.toLowerCase() === 'no') {
    return (
      <Chip
        label={status}
        size="small"
        color="success"
        icon={<CheckCircle fontSize="small" />}
        sx={{
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 500,
          '& .MuiChip-icon': { fontSize: '0.875rem' },
        }}
      />
    );
  }

  return <span>{status}</span>;
};

export default AssessmentsComponent;
