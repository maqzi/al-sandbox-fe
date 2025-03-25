import React, { useState } from 'react'; // Add useState
import { useDispatch } from 'react-redux';
import { 
  Box, Typography, Button, Card, CardContent, Grid, 
  Paper, Chip, Avatar, Container, Divider, Dialog, 
  DialogTitle, DialogContent, DialogActions, IconButton // Add Dialog components
} from '@mui/material';
import { 
  DesignServices, Build, TrendingUp, Bolt, 
  ArrowForward, CheckCircle, Speed, ContactSupport,
  BusinessCenter, LocalHospital, Assignment, Close, // Add Close icon
  InfoOutlined // Add Info icon
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
  // Add state for modal dialog
  const [infoModalOpen, setInfoModalOpen] = useState(false);

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

  return (
    <Container maxWidth="xl" sx={{ py: 6, px: 4 }}>
      {/* Welcome Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 5,
          mb: 5,
          borderRadius: 3,
          background: 'linear-gradient(145deg, #f6faff 0%, #f0f7ff 100%)',
          border: '1px solid #e6f0ff',
          position: 'relative',
          overflow: 'hidden'
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
            background: 'rgba(85, 105, 255, 0.08)' 
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
            background: 'rgba(85, 105, 255, 0.05)' 
          }} 
        />
      </Paper>

      {/* Card Section */}
      <Grid container spacing={3}>
        {/* Quick Access Cards */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Quick Access</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
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
                      label="2 Rules Available" 
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
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
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
                      label="3 Test Cases" 
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
            
            {/* Additional quick access features */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
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
                          borderRadius: 2
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
                          borderRadius: 2
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
                          borderRadius: 2
                        }}
                      >
                        <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">EHR Integration</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* System Status */}
        <Grid item xs={12} lg={4}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>System Status</Typography>
          <Card sx={{ mb: 3, borderRadius: 3 }}>
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
          
          <Card sx={{ borderRadius: 3 }}>
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
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Statistics Section */}
      <Box my={5}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Prototype Statistics</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              p: 3, 
              height: '100%',
              border: '1px solid #e6f0ff',
              boxShadow: 'none'
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
                  2
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
              boxShadow: 'none'
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
                  3
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
              boxShadow: 'none'
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
              boxShadow: 'none'
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

      {/* Information Modal */}
      <Dialog
        open={infoModalOpen}
        onClose={handleCloseInfoModal}
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
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
        <DialogContent sx={{ p: 4 }}>
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
                backgroundColor: '#ffffff'
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
                  automated process to ensure that the final decision is accurate, fair, and compliant.
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
                backgroundColor: '#ffffff'
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
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  An applicant has a history of Type 2 Diabetes and Obstructive Sleep Apnea (OSA), but they do not 
                  remember their A1c level or specific details about their AHI (Apnea-Hypopnea Index) score.
                  alitheia needs to verify this information in order to assess the applicant's risk class for the application. 
                  The system determines missing information and orders an EHR.
                  The EHR provides the missing information. This case is automated.
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
                backgroundColor: '#ffffff'
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      Verify EHR data
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      Understand the rules that were triggered
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      Review assessment results
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                  Goals:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      EHRs can assist with automation
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ color: '#00ab55', mr: 1, fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      Automated decisions can be inspected
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e6f0ff' }}>
          <Button 
            onClick={handleCloseInfoModal} 
            variant="outlined" 
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WelcomePage;