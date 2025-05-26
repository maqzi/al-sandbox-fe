import React from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Divider, 
  Chip, Avatar, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, List, ListItem, 
  ListItemIcon, ListItemText
} from '@mui/material';
import {
  Person, Cake, Timer, HomeWork, Phone, Email, 
  Payment, Security, MedicalServices, MonetizationOn,
  LocalHospital, CalendarMonth, CheckCircle, Error
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectSelectedCase } from '@/store/selectors';

const CaseDetailsComponent: React.FC = () => {
  // Get data directly from Redux state
  const selectedCase = useSelector(selectSelectedCase);
  // Ensure we have case data
  if (!selectedCase) {
    return null;
  }
  // Extract data from the selected case
  const personInfo = selectedCase.person || {};
  const policyInfo = selectedCase.policy || {};
  const contactInfo = personInfo.contact || {};
  const healthInfo = selectedCase.health || {};
  
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box>
      {/* Page Title */}
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          color: '#1a3353',
          display: 'flex',
          alignItems: 'center' 
        }}
      >
        <Person sx={{ mr: 1.5 }} /> Applicant Information
      </Typography>
      
      <Grid container spacing={3}>
        {/* Personal Information Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%' 
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 2
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.main',
                    width: 40, 
                    height: 40,
                    mr: 2
                  }}
                >
                  {personInfo.firstName ? personInfo.firstName[0] : 'A'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {personInfo.fullName || `${personInfo.firstName} ${personInfo.lastName}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Application ID: {selectedCase.id || 'APP-2023-0015'}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Cake fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Date of Birth" 
                        secondary={personInfo.birthDate || 'April 15, 1980'} 
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Timer fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Age" 
                        secondary={personInfo.age || '45'} 
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Person fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Gender" 
                        secondary={personInfo.gender || 'Male'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Phone fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone" 
                        secondary={contactInfo.phone || '(555) 123-4567'} 
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Email fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={contactInfo.email || 'john.smith@example.com'} 
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <HomeWork fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Address" 
                        secondary={contactInfo.address || '123 Main St, Anytown, USA'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Policy Information Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Policy Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Security fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Product Type" 
                        secondary={policyInfo.product || 'Term Life Insurance'} 
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <MonetizationOn fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Coverage Amount" 
                        secondary={policyInfo.faceAmount ? 
                          formatCurrency(policyInfo.faceAmount) : 
                          '$500,000'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Timer fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Policy Status" 
                        secondary={policyInfo.status || 'Active'} 
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CalendarMonth fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Application Date" 
                        secondary={policyInfo.applicationDate || 'March 12, 2025'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Payment Information */}
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
                Financial Information
              </Typography>
              
              <List dense disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Payment fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Policy Premium" 
                    secondary={policyInfo.premium ? 
                      formatCurrency(policyInfo.premium) : 
                      '$1,200'} 
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Payment fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Prior Policy" 
                    secondary={policyInfo.hasPriorPolicy || 'No'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Medical History Section */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 2, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Reported Medical History
              </Typography>
              
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eaedf3', borderRadius: 1 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Condition</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Reported</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date Diagnosed</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Treatment</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Verified by EHR</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {healthInfo.conditions?.map((condition, index) => (
                      <TableRow key={index}>
                        <TableCell>{condition.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={condition.reported ? "Yes" : "No"} 
                            size="small" 
                            color={condition.reported ? "success" : "default"}
                            sx={{ height: 24 }}
                          />
                        </TableCell>
                        <TableCell>{condition.diagnosed}</TableCell>
                        <TableCell>{condition.treatment}</TableCell>
                        <TableCell>
                          {condition.verified ? (
                            <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
                          ) : (
                            <Error sx={{ color: 'warning.main', fontSize: 18 }} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <LocalHospital sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                  Additional medical information is available in the EHR section.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseDetailsComponent;