import React, { useState } from 'react';
import { 
  Box, Typography, Tabs, Tab, Paper, Card, CardContent, 
  Button, Chip, Divider, Alert, Grid, Avatar,
  Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  ExpandMore, LocalHospital, FolderSpecial, CheckCircle, Warning,
  ErrorOutline, VerifiedUser, Article, Code, Search, Info,
  Lock as LockIcon, Assignment, LocalPharmacy, Security, 
  Description, Lightbulb // Change from LightbulbOutline to Lightbulb
} from '@mui/icons-material';
import SummarizerComponent from './SummarizerComponent';
import './css/WorkbenchComponent.css';
import { useSelector } from 'react-redux';

interface WorkbenchComponentProps {
  workbenchSection: string;
  handleWorkbenchSectionClick: (section: string) => void;
  diabetesIcdCodes: string[];
  sleepApneaIcdCodes: string[];
  handleSourceClick: (source: string) => void;
  isReferred: boolean;
  referralReason: string;
  extractedData: any;
  alitheiaEHRAssessments: any[];
  carrierRuleDecisions: any[];
  alitheiaAssessments: any[];
  summarizerComponentProps: any;
}

const WorkbenchComponent: React.FC<WorkbenchComponentProps> = ({
  workbenchSection,
  handleWorkbenchSectionClick,
  diabetesIcdCodes,
  sleepApneaIcdCodes,
  handleSourceClick,
  isReferred,
  referralReason,
  extractedData,
  alitheiaEHRAssessments,
  carrierRuleDecisions,
  alitheiaAssessments,
  summarizerComponentProps
}) => {
  const [showInfo, setShowInfo] = useState(true);

  const handleSectionChange = (event: React.SyntheticEvent, newValue: string) => {
    handleWorkbenchSectionClick(newValue);
  };

  const getStatusIcon = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'satisfied':
      case 'approve':
        return <CheckCircle className="assessment-icon rule-status-success" />;
      case 'not satisfied':
      case 'decline':
        return <ErrorOutline className="assessment-icon rule-status-error" />;
      default:
        return <Warning className="assessment-icon rule-status-warning" />;
    }
  };

  const getStatusChipClass = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'satisfied':
      case 'approve':
        return 'status-chip chip-success';
      case 'not satisfied':
      case 'decline':
        return 'status-chip chip-error';
      default:
        return 'status-chip chip-warning';
    }
  };

  return (
    <div className="workbench-component">
      <Box display="flex" className="workbench-container">
        {/* Left Side Navigation */}
        {/* <Box className="workbench-sidebar">
          <Paper elevation={0} className="sidebar-paper">
            <List component="nav" aria-label="workbench sections">
              <ListItem 
                button={false} 
                className="sidebar-item disabled"
              >
                <ListItemIcon>
                  <LockIcon className="sidebar-icon" />
                </ListItemIcon>
                <ListItemText primary="Case Details" />
              </ListItem>
              
              <ListItem 
                button={false} 
                className="sidebar-item disabled"
              >
                <ListItemIcon>
                  <LockIcon className="sidebar-icon" />
                </ListItemIcon>
                <ListItemText primary="Rx/Dx" />
              </ListItem>
              
              <ListItem 
                button={false} 
                className="sidebar-item disabled"
              >
                <ListItemIcon>
                  <LockIcon className="sidebar-icon" />
                </ListItemIcon>
                <ListItemText primary="MIB" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => handleWorkbenchSectionClick('EHRs')}
                selected={workbenchSection === 'EHRs'}
                className={`sidebar-item ${workbenchSection === 'EHRs' ? 'active' : ''}`}
              >
                <ListItemIcon>
                  <LocalHospital className="sidebar-icon" />
                </ListItemIcon>
                <ListItemText primary="EHRs" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => handleWorkbenchSectionClick('Rules')}
                selected={workbenchSection === 'Rules'}
                className={`sidebar-item ${workbenchSection === 'Rules' ? 'active' : ''}`}
              >
                <ListItemIcon>
                  <Code className="sidebar-icon" />
                </ListItemIcon>
                <ListItemText primary="Rules" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => handleWorkbenchSectionClick('Assessment')}
                selected={workbenchSection === 'Assessment'}
                className={`sidebar-item ${workbenchSection === 'Assessment' ? 'active' : ''}`}
              >
                <ListItemIcon>
                  <VerifiedUser className="sidebar-icon" />
                </ListItemIcon>
                <ListItemText primary="Assessment" />
              </ListItem>
              
              <ListItem 
                button={false} 
                className="sidebar-item disabled"
              >
                <ListItemIcon>
                  <LockIcon className="sidebar-icon" />
                </ListItemIcon>
                <ListItemText primary="Amendments" />
              </ListItem>

              <Divider className="sidebar-divider" />
              
              <ListItem 
                button 
                onClick={() => handleWorkbenchSectionClick('Ideas')}
                selected={workbenchSection === 'Ideas'}
                className={`sidebar-item ${workbenchSection === 'Ideas' ? 'active' : ''}`}
              >
                <ListItemIcon>
                  <Lightbulb className="sidebar-icon" /> 
                </ListItemIcon>
                <ListItemText primary="Ideas" />
              </ListItem>
            </List>
          </Paper>
        </Box> */}

        {/* Main Content */}
        <Box className="workbench-main-content">
          <div className="workbench-panel">
            {workbenchSection === 'EHRs' && (
              <>
                {showInfo && (
                  <div className="proto-info">
                    <Typography className="proto-title">
                      About This Prototype
                    </Typography>
                    <Typography variant="body2">
                      This prototype demonstrates alitheia's ability to extract meaningful health data from electronic health records (EHRs),
                      analyze the information, and provide automated assessments for underwriting decisions.
                    </Typography>
                  </div>
                )}

                {/* Patient Health Summary */}
                <SummarizerComponent />

                {/* Diagnosis Codes */}
                <Card className="summary-card">
                  <div className="summary-header">
                    <Typography className="summary-title">
                      <Code className="summary-icon" />
                      Diagnosis Codes
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleSourceClick('dxcodes')}
                      className="source-button"
                    >
                      View Source
                    </Button>
                  </div>
                  <CardContent className="summary-content">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom className="card-title">
                          Type 2 Diabetes
                        </Typography>
                        
                        {diabetesIcdCodes.map((code, index) => (
                          <div key={index} className="code-item">
                            <LocalHospital className="code-icon" />
                            <Typography className="code-value">
                              {code}
                            </Typography>
                            <Typography variant="body2" className="code-description">
                              Type 2 diabetes mellitus
                            </Typography>
                          </div>
                        ))}
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom className="card-title">
                          Obstructive Sleep Apnea
                        </Typography>
                        
                        {sleepApneaIcdCodes.map((code, index) => (
                          <div key={index} className="code-item">
                            <LocalHospital className="code-icon" />
                            <Typography className="code-value">
                              {code}
                            </Typography>
                            <Typography variant="body2" className="code-description">
                              Obstructive sleep apnea
                            </Typography>
                          </div>
                        ))}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Extracted Data */}
                <Card className="summary-card">
                  <div className="summary-header">
                    <Typography className="summary-title">
                      <FolderSpecial className="summary-icon" />
                      Extracted Health Data
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleSourceClick('extracted')}
                      className="source-button"
                    >
                      View Source
                    </Button>
                  </div>
                  <CardContent className="summary-content">
                    {/* Extracted Data Accordion */}
                    {Object.keys(extractedData).map((category, index) => (
                      <Accordion 
                        key={index} 
                        className="accordion-root"
                        classes={{ expanded: 'accordion-expanded' }}
                      >
                        <AccordionSummary 
                          expandIcon={<ExpandMore />}
                          className="accordion-summary"
                        >
                          <Typography variant="subtitle1">{category}</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="accordion-content">
                          <ul className="detail-list">
                            {Object.entries(extractedData[category]).map(([key, value]: [string, any], idx) => (
                              <li key={idx} className="detail-list-item">
                                <div className="detail-list-label">{key}</div>
                                <div className="detail-list-value">{value}</div>
                              </li>
                            ))}
                          </ul>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </CardContent>
                </Card>

                {/* EHR Assessments */}
                <Card className="summary-card">
                  <div className="summary-header">
                    <Typography className="summary-title">
                      <VerifiedUser className="summary-icon" />
                      alitheia EHR Assessments
                    </Typography>
                  </div>
                  <CardContent className="summary-content">
                    {(alitheiaEHRAssessments || []).map((assessment, index) => (
                      <div key={index} className="assessment-card">
                        <div className="assessment-header">
                          <Typography className="assessment-name">
                            {assessment.name || 'Unnamed Assessment'}
                          </Typography>
                          <div className="assessment-status">
                            <Chip 
                              label={assessment.assessment || 'Unknown'} 
                              className={getStatusChipClass(assessment.assessment || '')}
                            />
                          </div>
                        </div>
                        <Divider />
                        <div className="assessment-body">
                          {assessment.values && Object.entries(assessment.values).map(([key, value]: [string, any], idx) => (
                            <div key={idx} className="assessment-value-item">
                              <Typography className="assessment-label">{key}</Typography>
                              <Typography className="assessment-value">
                                {getStatusIcon(assessment.assessment || '')}
                                {value}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {workbenchSection === 'Health Questionnaire' && (
              <div className="empty-state">
                <Article className="empty-state-icon" />
                <Typography variant="h6" gutterBottom>No Health Questionnaire Data</Typography>
                <Typography variant="body2">
                  This prototype focuses on EHR data analysis. Health Questionnaire data is not included in this demo.
                </Typography>
              </div>
            )}

            {workbenchSection === 'Rules' && (
              <>
                <Alert 
                  icon={<Info className="info-alert-icon" />}
                  variant="outlined" 
                  severity="info"
                  className="info-alert"
                >
                  The following rules were evaluated against the extracted EHR data.
                </Alert>
                
                <Card className="summary-card">
                  <div className="summary-header">
                    <Typography className="summary-title">
                      <Code className="summary-icon" />
                      Carrier Rule Decisions
                    </Typography>
                  </div>
                  <CardContent className="summary-content">
                    {(carrierRuleDecisions || []).map((rule, index) => (
                      <div key={index} className="assessment-card">
                        <div className="assessment-header">
                          <Typography className="assessment-name">
                            {rule.name || 'Unnamed Rule'}
                          </Typography>
                          <div className="assessment-status">
                            <Chip 
                              label={rule.status || rule.riskClass || 'Unknown'} 
                              className={getStatusChipClass(rule.status || rule.riskClass || '')}
                            />
                          </div>
                        </div>
                        <Divider />
                        <div className="assessment-body">
                          <div className="assessment-value-item">
                            <Typography className="assessment-label">Rule Description</Typography>
                            <Typography className="assessment-value">
                              {rule.description}
                            </Typography>
                          </div>
                          <div className="assessment-value-item">
                            <Typography className="assessment-label">Condition</Typography>
                            <Typography className="assessment-value">
                              {rule.condition}
                            </Typography>
                          </div>
                          {rule.reason && (
                            <div className="assessment-value-item">
                              <Typography className="assessment-label">Reason</Typography>
                              <Typography className="assessment-value">
                                {rule.reason}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {workbenchSection === 'Assessment' && (
              <>
                {isReferred && (
                  <Alert 
                    icon={<Warning />} 
                    severity="warning"
                    className="info-alert"
                  >
                    <Typography variant="body1" fontWeight={500}>
                      This case requires human review
                    </Typography>
                    <Typography variant="body2">
                      Reason: {referralReason}
                    </Typography>
                  </Alert>
                )}
                
                <Card className="summary-card">
                  <div className="summary-header">
                    <Typography className="summary-title">
                      <VerifiedUser className="summary-icon" />
                      Automated Assessments
                    </Typography>
                  </div>
                  <CardContent className="summary-content">
                    {alitheiaAssessments.map((assessment, index) => (
                      <div key={index} className="assessment-card">
                        <div className="assessment-header">
                          <Typography className="assessment-name">
                            {assessment.name}
                          </Typography>
                          <div className="assessment-status">
                            <Chip 
                              label={assessment.outcome} 
                              className={getStatusChipClass(assessment.outcome === 'Approve' ? 'Satisfied' : 'Not Satisfied')}
                            />
                          </div>
                        </div>
                        <Divider />
                        <div className="assessment-body">
                          <div className="assessment-value-item">
                            <Typography className="assessment-label">Rating Class</Typography>
                            <Typography className="assessment-value">
                              {assessment.ratingClass}
                            </Typography>
                          </div>
                          <div className="assessment-value-item">
                            <Typography className="assessment-label">Table Rating</Typography>
                            <Typography className="assessment-value">
                              {assessment.tableRating}
                            </Typography>
                          </div>
                          <div className="assessment-value-item">
                            <Typography className="assessment-label">Flat Extra</Typography>
                            <Typography className="assessment-value">
                              {assessment.flatExtra}
                            </Typography>
                          </div>
                          {assessment.notes && (
                            <div className="assessment-value-item">
                              <Typography className="assessment-label">Notes</Typography>
                              <Typography className="assessment-value">
                                {assessment.notes}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {workbenchSection === 'Ideas' && (
              <div className="empty-state">
                <Lightbulb className="empty-state-icon" /> {/* Changed from LightbulbOutline to Lightbulb */}
                <Typography variant="h6" gutterBottom>Ideas & Suggestions</Typography>
                <Typography variant="body2">
                  This section would display AI-generated insights and suggestions based on the applicant's health data.
                </Typography>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default WorkbenchComponent;