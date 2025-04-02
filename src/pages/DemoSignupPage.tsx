import React from 'react';
import DemoSignupForm from '@/components/DemoSignupForm';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  useTheme, 
  useMediaQuery, 
  Card,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import { 
  HealthAndSafety as HealthIcon,
  CheckCircle as CheckIcon,
  VerifiedUser as VerifiedIcon,
  BusinessCenter as BusinessCenterIcon,
  LocalHospital as LocalHospitalIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import AlitheiaBranding from "@/components/AlitheiaBranding";

const DemoSignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleSignupComplete = (data: { name: string; email: string }) => {
    dispatch(setUser(data));
    navigate('/index');
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        backgroundImage: 'radial-gradient(#e0e7ff 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          bgcolor: '#fff',
        }}
      >
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <AlitheiaBranding variant="default" isHeader withTagline={true} />
      </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, flexGrow: 1 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Form Side */}
          <Grid item xs={12} md={5} order={{ xs: 2, md: 1 }}>
            <Box
              sx={{
                animation: 'fadeIn 0.8s ease-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 3, md: 4 }, 
                  borderRadius: 2,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  border: '1px solid',
                  borderColor: 'rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -60,
                    right: -60,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                    opacity: 0.06,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -45,
                    left: -45,
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    bgcolor: theme.palette.secondary.main,
                    opacity: 0.06,
                  }}
                />
                
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    color: theme.palette.text.primary
                  }}
                >
                  Get Started
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Sign up for exclusive access to our alitheia Labs environment.
                </Typography>

                <Box sx={{ position: 'relative', zIndex: 5 }}>
                  <DemoSignupForm onComplete={handleSignupComplete} />
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Info Side */}
          <Grid item xs={12} md={7} order={{ xs: 1, md: 2 }}>
            <Box 
              sx={{ 
                pl: { xs: 0, md: 4 },
                pr: { xs: 0, md: 2 },
                mb: { xs: 4, md: 0 }
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  border: '1px solid #e6f0ff',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f9fbff 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'slideIn 0.6s ease-out',
                  '@keyframes slideIn': {
                    '0%': { opacity: 0, transform: 'translateX(20px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                  },
                }}
              >
                <Typography 
                  variant="h5" 
                  align="center" 
                  sx={{ 
                    mb: 4, 
                    fontWeight: 600, 
                    color: '#1a3353',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 60,
                      height: 3,
                      backgroundColor: '#5569ff',
                      borderRadius: 2
                    }
                  }}
                >
                  Innovation starts with listening
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      p: 2.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      border: '1px solid #e6f0ff',
                      backgroundColor: '#ffffff',
                      animation: `fadeSlideIn 0.5s ease-out 0.2s both`,
                      '@keyframes fadeSlideIn': {
                        '0%': { opacity: 0, transform: 'translateY(10px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}>
                      <Box display="flex" alignItems="center" mb={1.5}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'rgba(85, 105, 255, 0.1)', 
                            color: '#5569ff',
                            width: 40,
                            height: 40,
                            mr: 1.5
                          }}
                        >
                          <BusinessCenterIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          Our Approach
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.875rem' }}>
                        With alitheia Labs, we prioritize partnerships with our clients. By working together, 
                        we develop innovative experiments to address real industry challenges, gather feedback and
                        iterate to enable solutions that offer most value to you!
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      p: 2.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      border: '1px solid #e6f0ff',
                      backgroundColor: '#ffffff',
                      animation: `fadeSlideIn 0.5s ease-out 0.3s both`,
                    }}>
                      <Box display="flex" alignItems="center" mb={1.5}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'rgba(0, 171, 85, 0.1)', 
                            color: '#00ab55',
                            width: 40,
                            height: 40,
                            mr: 1.5
                          }}
                        >
                          <LocalHospitalIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          Technical Excellence
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.875rem' }}>
                        We combine deep domain expertise with cutting-edge technology to develop underwriting solutions 
                        that deliver measurable outcomes. Our solutions are designed by underwriters for underwriters.

                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      p: 2.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      border: '1px solid #e6f0ff',
                      backgroundColor: '#ffffff',
                      animation: `fadeSlideIn 0.5s ease-out 0.4s both`,
                    }}>
                      <Box display="flex" alignItems="center" mb={1.5}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'rgba(255, 193, 7, 0.1)', 
                            color: '#ffc107',
                            width: 40,
                            height: 40,
                            mr: 1.5
                          }}
                        >
                          <AssignmentIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                          Building Together
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontSize: '0.8rem', fontWeight: 600 }}>
                            Our Collaborative Process:
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CheckIcon sx={{ color: '#00ab55', mr: 0.7, fontSize: 14 }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Understand client needs in depth
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CheckIcon sx={{ color: '#00ab55', mr: 0.7, fontSize: 14 }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Design solutions through co-creation
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CheckIcon sx={{ color: '#00ab55', mr: 0.7, fontSize: 14 }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Iterate based on ongoing feedback
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontSize: '0.8rem', fontWeight: 600 }}>
                            Client Benefits:
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CheckIcon sx={{ color: '#00ab55', mr: 0.7, fontSize: 14 }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Solutions aligned with business goals
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CheckIcon sx={{ color: '#00ab55', mr: 0.7, fontSize: 14 }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Faster time-to-value
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CheckIcon sx={{ color: '#00ab55', mr: 0.7, fontSize: 14 }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Transparency across development
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                                
                {/* Decorative elements */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: -15, 
                    right: -15, 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    background: 'rgba(0, 171, 85, 0.05)' 
                  }} 
                />
                
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: -20, 
                    left: -20, 
                    width: 100, 
                    height: 100, 
                    borderRadius: '50%', 
                    background: 'rgba(85, 105, 255, 0.03)' 
                  }} 
                />
              </Paper>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  alignItems: 'center',
                  mt: 2,
                  opacity: 0.8
                }}
              >
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          mt: 'auto',
          textAlign: 'center',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          bgcolor: '#fff',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} alitheia Labs. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default DemoSignupPage;