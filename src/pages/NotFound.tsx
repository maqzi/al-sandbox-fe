import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  SentimentDissatisfied as SadIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  useTheme,
} from '@mui/material';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 6,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          }}
        >
          {/* Animated background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              zIndex: 0,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: { xs: '80px', md: '120px' },
                  height: { xs: '80px', md: '120px' },
                  background: theme.palette.primary.main,
                  borderRadius: '50%',
                  opacity: '0.05',
                  transform: `scale(${Math.random() * 0.6 + 0.5})`,
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 80}%`,
                  animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 2}s`,
                  '@keyframes float': {
                    '0%, 100%': {
                      transform: `translate(0, 0) scale(${Math.random() * 0.6 + 0.5})`,
                    },
                    '50%': {
                      transform: `translate(${Math.random() * 40 - 20}px, ${
                        Math.random() * 40 - 20
                      }px) scale(${Math.random() * 0.6 + 0.5})`,
                    },
                  },
                }}
              />
            ))}
          </Box>

          <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', md: 'flex-start' },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Typography
                  variant="h1"
                  color="primary"
                  sx={{
                    fontSize: { xs: '4rem', sm: '8rem' },
                    fontWeight: 800,
                    lineHeight: 1,
                    mb: 2,
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: theme.palette.primary.main,
                      opacity: 0.1,
                      fontSize: '140%',
                      zIndex: -1,
                    }}
                  >
                    404
                  </span>
                  404
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                  }}
                >
                  Page Not Found
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, maxWidth: '500px' }}
                >
                  The page you're looking for doesn't exist or may have been
                  moved. Check the URL or try navigating back to the dashboard.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<HomeIcon />}
                    onClick={handleGoHome}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)',
                      '&:hover': {
                        boxShadow: '0 12px 20px rgba(25, 118, 210, 0.3)',
                      },
                    }}
                  >
                    Back to Home
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBack}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    Go Back
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '200px', sm: '300px' },
                  animation: 'pulse 3s infinite ease-in-out',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '50%': {
                      transform: 'translateY(-10px)',
                    },
                  },
                }}
              >
                <SadIcon
                  sx={{
                    fontSize: { xs: 120, sm: 180, md: 220 },
                    color: theme.palette.primary.light,
                    opacity: 0.6,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    mt: 2,
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    animation: 'fadeInOut 3s infinite ease-in-out',
                    '@keyframes fadeInOut': {
                      '0%, 100%': { opacity: 0.6 },
                      '50%': { opacity: 1 },
                    },
                  }}
                >
                  Oops! Something's missing...
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Need help? Contact{' '}
          <Typography
            component="a"
            href="mailto:support@alitheia-labs.com"
            color="primary"
            sx={{ textDecoration: 'none' }}
          >
            support@alitheia-labs.com
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound;
