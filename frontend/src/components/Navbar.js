import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Container,
  LinearProgress,
  Badge,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const { cartItemCount } = useCart();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Trips & Deals', path: '#' },
    { name: 'About us', path: '/about' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
  };

  const drawer = (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          TripNest
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={RouterLink} 
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{ 
              borderRadius: 2,
              mb: 1,
              backgroundColor: location.pathname === item.path ? 'rgba(0, 170, 108, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 170, 108, 0.05)',
              }
            }}
          >
            <ListItemText 
              primary={item.name} 
              sx={{ 
                color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                textAlign: 'center',
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          component={RouterLink}
          to="/cart"
          variant="outlined"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            borderRadius: 3,
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              backgroundColor: 'rgba(0, 170, 108, 0.05)',
            }
          }}
        >
          Cart ({cartItemCount})
        </Button>
        
        {!user ? (
          <>
            <Button
              component={RouterLink}
              to="/signin"
              variant="outlined"
              fullWidth
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                borderRadius: 3,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: 'rgba(0, 170, 108, 0.05)',
                }
              }}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: theme.palette.primary.main,
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              Join
            </Button>
          </>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
              Welcome, {user.username}!
            </Typography>
            <Button
              onClick={handleLogout}
              variant="outlined"
              fullWidth
              startIcon={<LogoutIcon />}
              sx={{
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                borderRadius: 3,
                '&:hover': {
                  borderColor: theme.palette.error.dark,
                  backgroundColor: 'rgba(244, 67, 54, 0.05)',
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          backgroundColor: 'white', 
          color: theme.palette.text.primary,
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <LocationOnIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  fontSize: '24px',
                  '&:hover': {
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                TripNest
              </Typography>
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 3, mr: 3 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      textTransform: 'none',
                      fontSize: '16px',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        backgroundColor: 'rgba(0, 170, 108, 0.05)',
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            )}
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <IconButton
                  component={RouterLink}
                  to="/cart"
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 170, 108, 0.05)',
                    }
                  }}
                >
                  <Badge badgeContent={cartItemCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                
                {!user ? (
                  // Show Sign In button when not logged in
                  <Button
                    component={RouterLink}
                    to="/signin"
                    variant="outlined"
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      borderRadius: 3,
                      px: 3,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: 'rgba(0, 170, 108, 0.05)',
                      }
                    }}
                  >
                    Sign In
                  </Button>
                ) : (
                  // Show user profile section when logged in
                  <>
                    <IconButton
                      onClick={handleUserMenuOpen}
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 170, 108, 0.05)',
                        }
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        <AccountCircleIcon />
                      </Avatar>
                    </IconButton>
                    
                    <Menu
                      anchorEl={userMenuAnchor}
                      open={Boolean(userMenuAnchor)}
                      onClose={handleUserMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem
                        component={RouterLink}
                        to="/order-history"
                        onClick={handleUserMenuClose}
                        sx={{ minWidth: 200 }}
                      >
                        <HistoryIcon sx={{ mr: 2 }} />
                        Order History
                      </MenuItem>
                      <MenuItem
                        component={RouterLink}
                        to="/change-password"
                        onClick={handleUserMenuClose}
                      >
                        <LockIcon sx={{ mr: 2 }} />
                        Change Password
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 2 }} />
                        Sign Out
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
        
        {/* Progress Bar */}
        <LinearProgress 
          variant="determinate" 
          value={0} 
          sx={{ 
            height: 3,
            backgroundColor: 'transparent',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main,
            }
          }} 
        />
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            border: 'none',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 