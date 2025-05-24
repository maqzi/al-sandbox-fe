import React, { useState, useRef, FormEvent } from 'react'; // Add FormEvent and useRef
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Button, Card, CardContent, Grid, 
  Paper, Chip, Avatar, Container, Divider, Dialog, 
  DialogTitle, DialogContent, DialogActions, IconButton,
  Tab, Tabs, TextField, Snackbar, Alert // Add Tab and Tabs components, TextField, Snackbar, Alert
} from '@mui/material';
import { 
  DesignServices, Build, TrendingUp, Bolt, 
  ArrowForward, CheckCircle, Speed, ContactSupport,
  BusinessCenter, LocalHospital, Assignment, Close,
  InfoOutlined, Code, DataObject, Email // Add icons for tabs, Email icon
} from '@mui/icons-material';
import { setStep } from '@/store/userSlice';

interface UserInfo {
  name: string;
  email: string;
}

interface WelcomePageProps {
  userInfo: UserInfo;
  handleLogout: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ userInfo, handleLogout }) => {
  const dispatch = useDispatch();
  // Add state for modal dialog and tabs
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Add new state for support modal
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo.name,
    email: userInfo.email,
    subject: '',
    message: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleStepChange = (step: number) => {
    dispatch(setStep(step));
  };

  // Add function to handle opening and closing the modal
  const handleOpenInfoModal = () => {
    setInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setInfoModalOpen(false);
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Add new handlers for support modal
  const handleSupportModalOpen = () => {
    setSupportModalOpen(true);
  };

  const handleSupportModalClose = () => {
    setSupportModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSupportFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would send an email here using an API
    // For this prototype, we'll simulate success
    
    console.log('Sending email to mqazi@munichre.com with data:', formData);
    
    // Show success message
    setSnackbarMessage('Your message has been sent successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    
    // Reset form and close modal
    setFormData({
      name: userInfo.name,
      email: userInfo.email,
      subject: '',
      message: ''
    });
    handleSupportModalClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6, px: 4 }}>
      {/* Welcome Header Section with enhanced hover effects */}
      <Paper
        elevation={0}
        sx={{
          p: 5,
          mb: 5,
          borderRadius: 3,
          background: 'linear-gradient(145deg, #f6faff 0%, #f0f7ff 100%)',
          border: '1px solid #e6f0ff',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ fontWeight: 700, color: '#1a3353' }}
            >
              Welcome {userInfo.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '90%' }}>
              Welcome to alitheia Labs. This prototype is designed to showcase alitheia's EHR Assessments and Rule AI features.
              You will be able to design rules and test them in a sandbox workbench environment on sample cases.
            </Typography>
            <Box display="flex" gap={2} sx={{ mt: 3 }}>
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleOpenInfoModal}
                startIcon={<InfoOutlined />}
                sx={{ 
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Prototype Information
              </Button>              
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              sx={{ 
                position: 'relative',
                height: '240px',
                width: '100%'
              }}
            >
              <Box 
                sx={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '280px',
                  height: '280px',
                  background: 'url(/dashboard-illustration.svg) no-repeat center center',
                  backgroundSize: 'contain'
                }}
              />
            </Box>
          </Grid>
        </Grid>
        
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -40, 
            right: -40, 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            background: 'rgba(85, 105, 255, 0.08)',
            transition: 'all 0.5s ease',
            '&:hover': {
              transform: 'scale(1.2)',
              background: 'rgba(85, 105, 255, 0.12)',
            }
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -30, 
            left: -30, 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: 'rgba(85, 105, 255, 0.05)',
            transition: 'all 0.5s ease',
            '&:hover': {
              transform: 'scale(1.2)',
              background: 'rgba(85, 105, 255, 0.12)',
            }
          }} 
        />
      </Paper>

      {/* Card Section with enhanced interactivity */}
      <Grid container spacing={3}>
        {/* Quick Access Cards */}
        <Grid item xs={12} lg={8}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '0%',
                height: '2px',
                bottom: '-4px',
                left: 0,
                background: '#5569ff',
                transition: 'width 0.3s ease'
              },
              '&:hover:after': {
                width: '100%'
              }
            }}
          >
            Quick Access
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    backgroundImage: 'linear-gradient(120deg, rgba(85, 105, 255, 0) 0%, rgba(85, 105, 255, 0) 100%)',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    zIndex: 1
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
                  },
                  '&:hover:before': {
                    opacity: 1,
                    backgroundImage: 'linear-gradient(120deg, rgba(85, 105, 255, 0.03) 0%, rgba(85, 105, 255, 0.08) 100%)'
                  },
                  '&:active': {
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => handleStepChange(1)}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(85, 105, 255, 0.1)', 
                        color: '#5569ff',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <DesignServices />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Rules Designer
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create and manage your rules with our visual editor. Test and iterate on your rule design.
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip 
                      label="3 Rules Available" 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                      sx={{ borderRadius: 1 }} 
                    />
                    <Button 
                      endIcon={<ArrowForward />}
                      sx={{ textTransform: 'none' }}
                    >
                      Open Designer
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    backgroundImage: 'linear-gradient(120deg, rgba(0, 171, 85, 0) 0%, rgba(0, 171, 85, 0) 100%)',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    zIndex: 1
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
                  },
                  '&:hover:before': {
                    opacity: 1,
                    backgroundImage: 'linear-gradient(120deg, rgba(0, 171, 85, 0.03) 0%, rgba(0, 171, 85, 0.08) 100%)'
                  },
                  '&:active': {
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => handleStepChange(2)}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(0, 171, 85, 0.1)', 
                        color: '#00ab55',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <Build />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Workbench
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Apply your rules to patient cases and see real-time results. Evaluate effectiveness with our testing suite.
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip 
                      label="2 Test Cases" 
                      size="small" 
                      color="success" 
                      variant="outlined" 
                      sx={{ borderRadius: 1 }} 
                    />
                    <Button 
                      endIcon={<ArrowForward />}
                      color="success"
                      sx={{ textTransform: 'none' }}
                    >
                      Open Workbench
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Additional quick access features with enhanced interactivity */}
            <Grid item xs={12}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Available Features
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          bgcolor: '#f8f9fc',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#eef1fb',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(85, 105, 255, 0.08)'
                          },
                          '&:active': {
                            transform: 'translateY(0px)'
                          }
                        }}
                      >
                        <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">Visual Rule Designer</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          bgcolor: '#f8f9fc',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#eef1fb',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(85, 105, 255, 0.08)'
                          },
                          '&:active': {
                            transform: 'translateY(0px)'
                          }
                        }}
                      >
                        <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">Rule AI</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          bgcolor: '#f8f9fc',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#eef1fb',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(85, 105, 255, 0.08)'
                          },
                          '&:active': {
                            transform: 'translateY(0px)'
                          }
                        }}
                      >
                        <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2"> Workbench</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          bgcolor: '#f8f9fc',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#eef1fb',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(85, 105, 255, 0.08)'
                          },
                          '&:active': {
                            transform: 'translateY(0px)'
                          }
                        }}
                      >
                        <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">EHR Assessments</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          alignItems: 'center', 
                          bgcolor: '#f8f9fc',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#eef1fb',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(85, 105, 255, 0.08)'
                          },
                          '&:active': {
                            transform: 'translateY(0px)'
                          }
                        }}
                      >
                        <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">Business Impact Metrics</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* System Status with enhanced interactivity */}
        <Grid item xs={12} lg={4}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              position: 'relative',
              display: 'inline-block',
              '&:after': {
                content: '""',
                position: 'absolute',
                width: '0%',
                height: '2px',
                bottom: '-4px',
                left: 0,
                background: '#5569ff',
                transition: 'width 0.3s ease'
              },
              '&:hover:after': {
                width: '100%'
              }
            }}
          >
            System Status
          </Typography>
          
          <Card 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Prototype Status
                </Typography>
                <Chip 
                  label="Active" 
                  size="small" 
                  color="success" 
                  sx={{ borderRadius: 1 }} 
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">System Uptime</Typography>
                  <Typography variant="body2" fontWeight={500}>99.9%</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body2" fontWeight={500}>Today at 9:41 AM</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Data Freshness</Typography>
                  <Typography variant="body2" fontWeight={500}>Real-time</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card 
            sx={{ 
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'rgba(255, 171, 0, 0.1)', 
                    color: '#ffab00',
                    width: 40,
                    height: 40,
                    mr: 2
                  }}
                >
                  <ContactSupport />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Need Help?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact our support team
                  </Typography>
                </Box>
              </Box>
              <Button 
                fullWidth 
                variant="outlined" 
                color="warning"
                onClick={() => window.location.href = "mailto:mqazi@munichre.com?subject=alitheia Labs Support"}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,171,0,0.2), transparent)',
                    transition: 'all 0.6s ease'
                  },
                  '&:hover:before': {
                    left: '100%'
                  }
                }}
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Statistics Section with enhanced interactivity */}
      <Box my={5}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: '0%',
              height: '2px',
              bottom: '-4px',
              left: 0,
              background: '#5569ff',
              transition: 'width 0.3s ease'
            },
            '&:hover:after': {
              width: '100%'
            }
          }}
        >
          Prototype Statistics
        </Typography>
        
        <Grid container spacing={3}>
          {/* Make each stat card interactive */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              p: 3, 
              height: '100%',
              border: '1px solid #e6f0ff',
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 24px rgba(85, 105, 255, 0.1)',
                border: '1px solid rgba(85, 105, 255, 0.3)'
              }
            }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(85, 105, 255, 0.1)', 
                  color: '#5569ff',
                  width: 40,
                  height: 40,
                  mr: 2
                }}>
                  <DesignServices />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  3
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total Decision Rules
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              p: 3, 
              height: '100%',
              border: '1px solid #e6f0ff',
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 24px rgba(0, 171, 85, 0.1)',
                border: '1px solid rgba(0, 171, 85, 0.3)'
              }
            }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(0, 171, 85, 0.1)', 
                  color: '#00ab55',
                  width: 40,
                  height: 40,
                  mr: 2
                }}>
                  <Speed />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  2
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Test Cases Available
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              p: 3, 
              height: '100%',
              border: '1px solid #e6f0ff',
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 24px rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.3)'
              }
            }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255, 193, 7, 0.1)', 
                  color: '#ffc107',
                  width: 40,
                  height: 40,
                  mr: 2
                }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  100%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Assessment Accuracy
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              p: 3, 
              height: '100%',
              border: '1px solid #e6f0ff',
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 24px rgba(255, 86, 48, 0.1)',
                border: '1px solid rgba(255, 86, 48, 0.3)'
              }
            }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255, 86, 48, 0.1)', 
                  color: '#ff5630',
                  width: 40,
                  height: 40,
                  mr: 2
                }}>
                  <Bolt />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  &lt;0.5s
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Average Response Time
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Information Modal with enhanced interactivity */}
      <Dialog
        open={infoModalOpen}
        onClose={handleCloseInfoModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s ease',
          },
        }}
        TransitionProps={{
          timeout: 500,
        }}
      >
        <DialogTitle sx={{ 
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e6f0ff',
          background: 'linear-gradient(145deg, #ffffff 0%, #f9fbff 100%)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BusinessCenter sx={{ color: '#5569ff', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              An automated day in the life of a modern life insurance Underwriter
            </Typography>
          </Box>
          <IconButton 
            aria-label="close" 
            onClick={handleCloseInfoModal}
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              px: 3, 
              pt: 2,
              '& .MuiTab-root': {
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(85, 105, 255, 0.05)'
                }
              },
              '& .Mui-selected': {
                fontWeight: 600,
                transition: 'all 0.3s ease'
              }
            }}
          >
            <Tab 
              icon={<LocalHospital />} 
              label="EHR Assessments" 
              iconPosition="start" 
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
            <Tab 
              icon={<Code />} 
              label="Rule AI" 
              iconPosition="start" 
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
          </Tabs>
        </Box>
        
        <DialogContent sx={{ p: 4 }}>
          {/* EHR Assessments Tab with enhanced interactivity */}
          {tabValue === 0 && (
            <Grid container spacing={4}>
              {/* Make each card in the grid have hover effects */}
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #e6f0ff',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(85, 105, 255, 0.1)',
                    border: '1px solid rgba(85, 105, 255, 0.3)'
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(85, 105, 255, 0.1)', 
                        color: '#5569ff',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <BusinessCenter />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Underwriters
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    A key player in evaluating and assessing the risk associated with an applicant applying for insurance. 
                    The underwriter holds responsibility for overseeing, interpreting, and sometimes intervening in the 
                    process to ensure that the final decision is accurate, fair, and compliant.
                  </Typography>
                </Box>
              </Grid>
              
              {/* Apply similar effects to other items */}
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #e6f0ff',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 171, 85, 0.1)',
                    border: '1px solid rgba(0, 171, 85, 0.3)'
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(0, 171, 85, 0.1)', 
                        color: '#00ab55',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <LocalHospital />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Context
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                  In two distinct scenarios, applicants with existing health conditions require alitheia 
                  to verify missing medical information for risk assessment. In the first case, an 
                  applicant with Type 2 Diabetes lacks their A1c level, which alitheia successfully 
                  retrieves via an EHR order, leading to automated processing. Conversely, the second 
                  case involves an applicant with both Type 2 Diabetes and Obstructive Sleep Apnea who 
                  cannot recall their A1c or AHI scores. While alitheia obtains the A1c information through
                   an EHR, the AHI data remains unavailable, necessitating a referral for manual review.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #e6f0ff',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.3)'
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(255, 193, 7, 0.1)', 
                        color: '#ffc107',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <Assignment />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Key Activities & Goals
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 600 }}>
                    Activities:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column',  mb: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Verify EHR data
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Understand the rules that were triggered
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Review assessment results
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                    Goals:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Ensure transparency and inspectability of automated decisions.
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Enable seamless EHR data integration for automated decision-making.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Rule AI Tab with similar enhancements */}
          {tabValue === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #e6f0ff',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(85, 105, 255, 0.1)',
                    border: '1px solid rgba(85, 105, 255, 0.3)'
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(85, 105, 255, 0.1)', 
                        color: '#5569ff',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <BusinessCenter />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Rule Designers
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Rule Designers are anyone from Underwriters who want to observe how much they can improve the decisions 
                    to Chief Underwriters and actuaries who want to see the performance improvements of a rule update 
                    to the full program.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #e6f0ff',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 171, 85, 0.1)',
                    border: '1px solid rgba(0, 171, 85, 0.3)'
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(0, 171, 85, 0.1)', 
                        color: '#00ab55',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <Code />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Context
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Populating rules from scratch to a new engine can be an onerous task. This is where Rule AI comes to the rescue. 
                    Rule AI empowers users to design intelligent, automated decision-making rules from your manuals. Gen AI is used 
                    to enable seamless integration of AI-driven rule generation into workflows. Test and refine your rules in a 
                    sandbox environment for optimal results.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  border: '1px solid #e6f0ff',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.3)'
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(255, 193, 7, 0.1)', 
                        color: '#ffc107',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <Assignment />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Key Activities & Goals
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 600 }}>
                    Activities:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Transform complex manuals into automated rules with Rule AI
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Use Rule AI recommendations to refine those rules as well as explain them in English
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Test and verify rules in a sandbox environment and evaluate against program performance
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                    Goals:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Ensure ease of rule generation and refinement
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                    }}>
                      <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        Provide transparent explanation of rule logic and business impact
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e6f0ff' }}>
          <Button 
            onClick={handleCloseInfoModal} 
            variant="outlined" 
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(85, 105, 255, 0.2)'
              },
              '&:active': {
                transform: 'translateY(0)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Contact Support Modal */}
      <Dialog
        open={supportModalOpen}
        onClose={handleSupportModalClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          },
        }}
      >
        <DialogTitle sx={{ 
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e6f0ff',
          background: 'linear-gradient(145deg, #ffffff 0%, #f9fbff 100%)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ContactSupport sx={{ color: '#ffab00', mr: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Contact Support
            </Typography>
          </Box>
          <IconButton 
            aria-label="close" 
            onClick={handleSupportModalClose}
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <form onSubmit={handleSupportFormSubmit}>
          <DialogContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                  required
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  You can also email our support team at <b><a href="mailto:mqazi@munichre.com?subject=alitheia Labs Support">mqazi@munichre.com</a></b>. We'll get back to you as soon as possible.
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e6f0ff', justifyContent: 'space-between' }}>
            <Button 
              onClick={handleSupportModalClose} 
              variant="outlined"
              color="inherit"
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              variant="contained"
              color="warning"
              startIcon={<Email />}
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 600,
                transition: 'all 0.2s ease',
                px: 3,
              }}
            >
              Send Message
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Success/Error Notification */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WelcomePage;