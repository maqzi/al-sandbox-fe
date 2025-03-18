import React from 'react';
import { 
  Box, Typography, List, ListItem, ListItemIcon, ListItemText,
  Paper, Badge, Chip, Divider
} from '@mui/material';
import {
  Person, DirectionsCar, LocalHospital, 
  Assignment, Lock, Description, KeyboardArrowRight, 
  Assessment
} from '@mui/icons-material';

interface WorkbenchSideMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  caseInfo?: {
    id: string;
    name: string;
    age: number;
    date: string;
    conditions: string[];
  };
}

const WorkbenchSideMenu: React.FC<WorkbenchSideMenuProps> = ({ 
  activeSection, 
  onSectionChange,
  caseInfo = {
    id: 'CASE-2023-0015',
    name: 'John Smith',
    age: 45,
    date: 'March 12, 2025',
    conditions: ['Type 2 Diabetes', 'Obstructive Sleep Apnea']
  } 
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{
        width: 260,
        height: '100%',
        borderRight: '1px solid #e0e0e0',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a3353' }}>
          Case Workbench
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Case ID: {caseInfo.id}
        </Typography>
      </Box>

      <List sx={{ width: '100%', p: 0 }}>
        {/* Case Details */}
        <ListItem
          button
          selected={activeSection === 'Case Details'}
          onClick={() => onSectionChange('Case Details')}
          sx={{
            borderLeft: activeSection === 'Case Details' ? '4px solid #5569ff' : '4px solid transparent',
            bgcolor: activeSection === 'Case Details' ? 'rgba(85, 105, 255, 0.08)' : 'transparent',
            '&:hover': {
              bgcolor: activeSection === 'Case Details' ? 'rgba(85, 105, 255, 0.12)' : 'rgba(0, 0, 0, 0.04)'
            },
            py: 1.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Person color={activeSection === 'Case Details' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Case Details" 
            primaryTypographyProps={{ 
              fontWeight: activeSection === 'Case Details' ? 600 : 400,
              color: activeSection === 'Case Details' ? 'primary.main' : 'inherit' 
            }}
          />
          <KeyboardArrowRight color="action" fontSize="small" />
        </ListItem>
        
        {/* MIB (locked) */}
        <ListItem
          button
          disabled
          sx={{
            opacity: 0.6,
            py: 1.5,
            '&:hover': {
              bgcolor: 'transparent'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Badge
              badgeContent={<Lock sx={{ fontSize: 10 }} />}
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              sx={{ '& .MuiBadge-badge': { bgcolor: '#f5f5f5', color: '#9e9e9e', border: '1px solid #e0e0e0' } }}
            >
              <Description />
            </Badge>
          </ListItemIcon>
          <ListItemText 
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                MIB
                <Chip 
                  label="locked" 
                  size="small" 
                  sx={{ 
                    ml: 1, 
                    fontSize: '0.65rem', 
                    height: 18, 
                    color: '#9e9e9e',
                    bgcolor: '#f5f5f5',
                    border: '1px solid #e0e0e0' 
                  }} 
                />
              </Box>
            }
          />
        </ListItem>
        
        {/* MVR (locked) */}
        <ListItem
          button
          disabled
          sx={{
            opacity: 0.6,
            py: 1.5,
            '&:hover': {
              bgcolor: 'transparent'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Badge
              badgeContent={<Lock sx={{ fontSize: 10 }} />}
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              sx={{ '& .MuiBadge-badge': { bgcolor: '#f5f5f5', color: '#9e9e9e', border: '1px solid #e0e0e0' } }}
            >
              <DirectionsCar />
            </Badge>
          </ListItemIcon>
          <ListItemText 
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                MVR
                <Chip 
                  label="locked" 
                  size="small" 
                  sx={{ 
                    ml: 1, 
                    fontSize: '0.65rem', 
                    height: 18, 
                    color: '#9e9e9e',
                    bgcolor: '#f5f5f5',
                    border: '1px solid #e0e0e0' 
                  }} 
                />
              </Box>
            }
          />
        </ListItem>
        
        {/* EHR */}
        <ListItem
          button
          selected={activeSection === 'EHRs'}
          onClick={() => onSectionChange('EHRs')}
          sx={{
            borderLeft: activeSection === 'EHRs' ? '4px solid #5569ff' : '4px solid transparent',
            bgcolor: activeSection === 'EHRs' ? 'rgba(85, 105, 255, 0.08)' : 'transparent',
            '&:hover': {
              bgcolor: activeSection === 'EHRs' ? 'rgba(85, 105, 255, 0.12)' : 'rgba(0, 0, 0, 0.04)'
            },
            py: 1.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Badge
              badgeContent="1"
              color="primary"
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              invisible={activeSection === 'EHRs'}
            >
              <LocalHospital color={activeSection === 'EHRs' ? 'primary' : 'inherit'} />
            </Badge>
          </ListItemIcon>
          <ListItemText 
            primary="Electronic Health Records" 
            primaryTypographyProps={{ 
              fontWeight: activeSection === 'EHRs' ? 600 : 400,
              color: activeSection === 'EHRs' ? 'primary.main' : 'inherit' 
            }}
          />
          <KeyboardArrowRight color="action" fontSize="small" />
        </ListItem>
        
        {/* Assessment */}
        <ListItem
          button
          selected={activeSection === 'Assessment'}
          onClick={() => onSectionChange('Assessment')}
          sx={{
            borderLeft: activeSection === 'Assessment' ? '4px solid #5569ff' : '4px solid transparent',
            bgcolor: activeSection === 'Assessment' ? 'rgba(85, 105, 255, 0.08)' : 'transparent',
            '&:hover': {
              bgcolor: activeSection === 'Assessment' ? 'rgba(85, 105, 255, 0.12)' : 'rgba(0, 0, 0, 0.04)'
            },
            py: 1.5,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Assessment color={activeSection === 'Assessment' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Assessment" 
            primaryTypographyProps={{ 
              fontWeight: activeSection === 'Assessment' ? 600 : 400,
              color: activeSection === 'Assessment' ? 'primary.main' : 'inherit' 
            }}
          />
          <KeyboardArrowRight color="action" fontSize="small" />
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        {/* Case Summary */}
        <Box sx={{ p: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            CASE SUMMARY
          </Typography>
          
          <Box sx={{ 
            mt: 1.5, 
            p: 1.5, 
            bgcolor: 'rgba(85, 105, 255, 0.04)', 
            borderRadius: 1, 
            border: '1px solid rgba(85, 105, 255, 0.1)'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {caseInfo.name}, {caseInfo.age}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Application Date: {caseInfo.date}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {caseInfo.conditions.join(', ')}
            </Typography>
            
            <Box sx={{ mt: 1.5, display: 'flex', gap: 0.5 }}>
              <Chip 
                label="T2D" 
                size="small" 
                sx={{ 
                  fontSize: '0.65rem', 
                  height: 20,
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                  color: '#ff9800',
                  fontWeight: 500,
                }}
              />
              <Chip 
                label="OSA" 
                size="small" 
                sx={{ 
                  fontSize: '0.65rem', 
                  height: 20,
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                  color: '#ff9800',
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>
        </Box>
      </List>
      
      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #f0f0f0' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', textAlign: 'center' }}>
          Demo Case: Data is simulated for demonstration purposes only.
        </Typography>
      </Box>
    </Paper>
  );
};

export default WorkbenchSideMenu;