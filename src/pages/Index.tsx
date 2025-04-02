import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { 
  Box, AppBar, Toolbar, Typography, Button, Menu, MenuItem, 
  Avatar, Divider, IconButton, Tooltip, Container, Paper,
  Breadcrumbs, Link, Fade
} from "@mui/material";
import { 
  MenuOutlined, Home, DesignServices, Build, ExitToApp,
  ChevronRight, Person, ArrowDropDown
} from '@mui/icons-material';
import { toast } from "sonner";
import RulesDesignerPage from "@/pages/RulesDesignerPage";
import WorkbenchPage from "@/pages/WorkbenchPage";
import WelcomePage from "@/pages/WelcomePage";
import { setUser, setStep } from "@/store/userSlice";
import AlitheiaBranding from "@/components/AlitheiaBranding";

const Index = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user);
  const step = useSelector((state: RootState) => state.user.step);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [workbenchSection, setWorkbenchSection] = useState<string | null>("EHRs");
  const [pageTitle, setPageTitle] = useState("");

  const handleSourceClick = (doc: string) => {
    // Track source document views
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'view_source', {
        document_name: doc,
        step: step,
        user_email: userInfo.email
      });
    }
    toast.info(`Opening source document: ${doc}`);
  };

  const handleStepChange = (newStep: number) => {
    // Track step navigation
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'navigation', {
        from_step: step,
        to_step: newStep,
        user_email: userInfo.email
      });
    }
    dispatch(setStep(newStep));
    
    // Set page title based on step
    switch (newStep) {
      case 0:
        setPageTitle("");
        break;
      case 1:
        setPageTitle("Rules Designer");
        break;
      case 2: 
        setPageTitle("Workbench");
        break;
      default:
        setPageTitle("");
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleMenuItemClick = (newStep: number) => {
    handleStepChange(newStep);
    handleMenuClose();
  };

  const handleWorkbenchSectionClick = (section: string) => {
    setWorkbenchSection(section);
  };

  const handleLogout = () => {
    dispatch(setUser({ name: '', email: '' }));
    dispatch(setStep(0));
    handleUserMenuClose();
  };

  // Set initial page title when component mounts
  useEffect(() => {
    switch (step) {
      case 0:
        setPageTitle("");
        break;
      case 1:
        setPageTitle("Rules Designer");
        break;
      case 2: 
        setPageTitle("Workbench");
        break;
      default:
        setPageTitle("");
    }
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomePage userInfo={userInfo} handleLogout={handleLogout} />;
      case 1:
        return <RulesDesignerPage handleStepChange={handleStepChange} />;
      case 2:
        return <WorkbenchPage 
          handleStepChange={handleStepChange} 
          handleWorkbenchSectionClick={handleWorkbenchSectionClick} 
          handleSourceClick={handleSourceClick} 
        />;
      default:
        return null;
    }
  };

  const renderBreadcrumbs = () => {
    if (step === 0) return null;
    
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          padding: '12px 24px',
          backgroundColor: '#f8f9fc',
          borderRadius: 0
        }}
      >
        <Breadcrumbs separator={<ChevronRight fontSize="small" />} aria-label="breadcrumb">
          <Link 
            color="inherit" 
            href="#" 
            onClick={() => handleStepChange(0)}
            sx={{ 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          {step === 1 && (
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <DesignServices sx={{ mr: 0.5, fontSize: 18 }} />
              Rules Designer
            </Typography>
          )}
          {step === 2 && (
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <Build sx={{ mr: 0.5, fontSize: 18 }} />
              Workbench
            </Typography>
          )}
        </Breadcrumbs>
      </Paper>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {userInfo.name && (
        <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <AlitheiaBranding variant="default" isHeader withTagline={false} />
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: 'none', md: 'block' } }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button 
                  color={step === 0 ? "primary" : "inherit"}
                  onClick={() => handleStepChange(0)}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: step === 0 ? 600 : 400,
                    borderBottom: step === 0 ? '3px solid #5569ff' : '3px solid transparent',
                    borderRadius: 0,
                    px: 2,
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  color={step === 1 ? "primary" : "inherit"}
                  onClick={() => handleStepChange(1)}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: step === 1 ? 600 : 400,
                    borderBottom: step === 1 ? '3px solid #5569ff' : '3px solid transparent',
                    borderRadius: 0,
                    px: 2
                  }}
                >
                  Rules Designer
                </Button>
                <Button 
                  color={step === 2 ? "primary" : "inherit"}
                  onClick={() => handleStepChange(2)}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: step === 2 ? 600 : 400,
                    borderBottom: step === 2 ? '3px solid #5569ff' : '3px solid transparent',
                    borderRadius: 0,
                    px: 2
                  }}
                >
                  Workbench
                </Button>
              </Box>
            </Box>
            
            {/* Mobile menu */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton onClick={handleMenuClick} size="large" edge="start" color="inherit" aria-label="menu">
                <MenuOutlined />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => handleMenuItemClick(0)}>Dashboard</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(1)}>Rules Designer</MenuItem>
                <MenuItem onClick={() => handleMenuItemClick(2)}>Workbench</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
            
            {/* User profile section */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Tooltip title="Account settings">
                <Button 
                  onClick={handleUserMenuClick}
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: '20px',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                  endIcon={<ArrowDropDown />}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      backgroundColor: '#5569ff',
                      marginRight: 1 
                    }}
                  >
                    {userInfo.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {userInfo.name}
                </Button>
              </Tooltip>
              <Menu
                anchorEl={userMenuAnchorEl}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleUserMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Breadcrumbs */}
      {userInfo.name && renderBreadcrumbs()}

      {/* Main Content */}
      <Fade in={true} timeout={300}>
        <Container maxWidth={false} sx={{ flex: 1, padding: 0 }}>
          {renderStep()}
        </Container>
      </Fade>
            {/* Footer */}
            <Box 
        mt={5} 
        pt={3} 
        sx={{ 
          borderTop: '1px solid #eaedf3',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 alitheia Labs - All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Index;