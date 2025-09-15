import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About us', path: '/about' },
        { name: 'Careers', path: '#' },
        { name: 'Press', path: '#' },
        { name: 'Blog', path: '#' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { name: 'Help Centre', path: '#' },
        { name: 'Contact us', path: '#' },
        { name: 'Privacy Policy', path: '#' },
        { name: 'Terms of Use', path: '#' },
      ],
    },
    {
      title: 'More',
      links: [
        { name: 'African Home Adventure Safaris', path: '#' },
        { name: 'Book tours & activities', path: '#' },
        { name: 'Volunteering Programs', path: '#' },
        { name: 'Travel Articles', path: '#' },
      ],
    },
    {
      title: 'Follow us',
      links: [
        { name: 'Facebook', icon: <Facebook />, path: '#' },
        { name: 'Twitter', icon: <Twitter />, path: '#' },
        { name: 'Instagram', icon: <Instagram />, path: '#' },
        { name: 'YouTube', icon: <YouTube />, path: '#' },
      ],
    },
  ];

  const handleComingSoon = (e) => {
    e.preventDefault();
    // You can replace this with a proper modal or notification
    console.log('Coming Soon');
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        mt: 'auto',
      }}
    >
      <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 6 } }}>
        {/* Footer Content */}
        <Grid 
          container 
          spacing={{ xs: 3, md: 4 }} 
          sx={{ 
            maxWidth: '100%',
            justifyContent: 'space-between',
            '& > .MuiGrid-item': {
              flex: '1 1 auto',
              minWidth: { xs: '100%', sm: '45%', md: '22%' }
            }
          }}
        >
          {footerSections.map((section) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: '16px',
                }}
              >
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.name} sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      onClick={link.path === '#' ? handleComingSoon : undefined}
                      sx={{
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {link.icon && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {link.icon}
                        </Box>
                      )}
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: 'rgba(0,0,0,0.1)' }} />

        {/* Footer Bottom */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 2,
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            &copy; 2025 TripNest LLC All rights reserved.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <Link
              href="#"
              onClick={handleComingSoon}
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '12px',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Privacy
            </Link>
            <Link
              href="#"
              onClick={handleComingSoon}
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '12px',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Terms
            </Link>
            <Link
              href="#"
              onClick={handleComingSoon}
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '12px',
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer; 