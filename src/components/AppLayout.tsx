import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, useParams, Outlet } from "react-router-dom";
import { RootState } from "@/store/store";
import { 
  Box, AppBar, Toolbar, Typography, Button, Menu, MenuItem, 
  Avatar, Divider, IconButton, Tooltip, Container, Paper,
  Breadcrumbs, Link, Fade
} from "@mui/material";
import { 
  MenuOutlined, Home, DesignServices, Build, ExitToApp,
  ChevronRight, ArrowDropDown, Palette, Straighten, 
} from '@mui/icons-material';
import { setUser } from "@/store/userSlice";
import AlitheiaBranding from "@/components/AlitheiaBranding";

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { ruleId } = useParams<{ ruleId: string }>();
  const userInfo = useSelector((state: RootState) => state.user);
  const activeRule = useSelector((state: RootState) => state.rules.activeRule);
  const activeVersion = useSelector((state: RootState) => state.rules.activeVersion);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);

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

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    dispatch(setUser({ name: '', email: '' }));
    navigate('/signup');
    handleUserMenuClose();
  };

  const isActive = (path: string) => location.pathname === path;

  const renderBreadcrumbs = () => {
    if (location.pathname === '/welcome') return null;
    
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          padding: '12px 24px',
          backgroundColor: '#f8f9fc',
          borderRadius: 0,
          overflow: 'hidden',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Breadcrumbs 
          separator={<ChevronRight fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{
            width: '100%',
            '& .MuiBreadcrumbs-ol': {
              flexWrap: 'nowrap',
              alignItems: 'center',
              display: 'flex !important',
              flexDirection: 'row !important'
            },
            '& .MuiBreadcrumbs-li': {
              whiteSpace: 'nowrap',
              display: 'inline-flex !important'
            },
            '& .MuiBreadcrumbs-separator': {
              margin: '0 8px',
              display: 'inline-flex !important'
            }
          }}
        >
          <Link 
            color="inherit" 
            href="#" 
            onClick={() => navigate('/welcome')}
            sx={{ 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <Home sx={{ mr: 0.5, fontSize: 18 }} />
            Home
          </Link>
          
          {location.pathname === '/rules-designer' && (
            <Typography color="text.primary" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <DesignServices sx={{ mr: 0.5, fontSize: 18 }} />
              Rules Designer
            </Typography>
          )}
          
          {location.pathname === '/workbench' && (
            <Typography color="text.primary" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <Build sx={{ mr: 0.5, fontSize: 18 }} />
              Workbench
            </Typography>
          )}
          
          {/* Whiteboard breadcrumbs */}
          {(location.pathname.includes('/whiteboard')) && (
            <Link 
              color="inherit" 
              href="#" 
              onClick={() => navigate('/rules-designer')}
              sx={{ 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <DesignServices sx={{ mr: 0.5, fontSize: 18 }} />
              Rules Designer
            </Link>
          )}
          
          {(location.pathname.includes('/whiteboard')) && (
            <Typography 
              color="text.primary" 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '300px'
              }}
            >
              <Straighten sx={{ mr: 0.5, fontSize: 18 }} />
              {activeRule ? activeRule.name : 'Rule Whiteboard'}
            </Typography>
          )}
        </Breadcrumbs>
      </Paper>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <AlitheiaBranding variant="default" isHeader withTagline={false} />
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: 'none', md: 'block' } }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                color={isActive('/welcome') ? "primary" : "inherit"}
                onClick={() => navigate('/welcome')}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: isActive('/welcome') ? 600 : 400,
                  borderBottom: isActive('/welcome') ? '3px solid #5569ff' : '3px solid transparent',
                  borderRadius: 0,
                  px: 2,
                }}
              >
                Dashboard
              </Button>
              <Button 
                color={isActive('/rules-designer') ? "primary" : "inherit"}
                onClick={() => navigate('/rules-designer')}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: isActive('/rules-designer') ? 600 : 400,
                  borderBottom: isActive('/rules-designer') ? '3px solid #5569ff' : '3px solid transparent',
                  borderRadius: 0,
                  px: 2
                }}
              >
                Rules Designer
              </Button>
              <Button 
                color={isActive('/workbench') ? "primary" : "inherit"}
                onClick={() => navigate('/workbench')}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: isActive('/workbench') ? 600 : 400,
                  borderBottom: isActive('/workbench') ? '3px solid #5569ff' : '3px solid transparent',
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
              <MenuItem onClick={() => handleMenuItemClick('/welcome')}>Dashboard</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('/rules-designer')}>Rules Designer</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('/workbench')}>Workbench</MenuItem>
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

      {/* Breadcrumbs */}
      {renderBreadcrumbs()}

      {/* Main Content */}
      <Fade in={true} timeout={300}>
        <Container maxWidth={false} sx={{ flex: 1, padding: 0 }}>
          <Outlet />
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

export default AppLayout;