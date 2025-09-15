import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Stack,
  Button,
} from '@mui/material';
import {
  Flight,
  Security,
  Support,
  TrendingUp,
  People,
  Star,
  Explore,
  ContactSupport,
} from '@mui/icons-material';

const About = () => {
  const stats = [
    { icon: <Flight sx={{ fontSize: 40, color: 'primary.main' }} />, number: '50+', label: 'Destinations' },
    { icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />, number: '10K+', label: 'Happy Travelers' },
    { icon: <Star sx={{ fontSize: 40, color: 'primary.main' }} />, number: '4.8', label: 'Average Rating' },
    { icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />, number: '95%', label: 'Satisfaction Rate' },
  ];

  const values = [
    {
      title: 'Authentic Experiences',
      description: 'We believe in providing genuine, local experiences that go beyond typical tourist attractions.',
      icon: <Flight sx={{ fontSize: 30, color: 'primary.main' }} />,
    },
    {
      title: 'Quality Assurance',
      description: 'Every destination, hotel, and activity is carefully vetted to ensure the highest standards.',
      icon: <Star sx={{ fontSize: 30, color: 'primary.main' }} />,
    },
    {
      title: 'Customer First',
      description: 'Your satisfaction and safety are our top priorities in everything we do.',
      icon: <Support sx={{ fontSize: 30, color: 'primary.main' }} />,
    },
    {
      title: 'Sustainable Travel',
      description: 'We promote responsible tourism that benefits local communities and preserves natural beauty.',
      icon: <Security sx={{ fontSize: 30, color: 'primary.main' }} />,
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former travel journalist with 15+ years of experience exploring the world.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      bio: 'Expert in travel logistics and customer experience optimization.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Creative Director',
      bio: 'Passionate about creating memorable travel experiences and stunning visuals.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00aa6c 0%, #008c5a 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
              mb: 3,
            }}
          >
            About TripNest
          </Typography>
          <Typography
            variant="h5"
            sx={{
              opacity: 0.95,
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              lineHeight: 1.6,
            }}
          >
            We're passionate about making travel accessible, authentic, and unforgettable for everyone
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 3,
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              paragraph
              sx={{
                fontWeight: 500,
                mb: 3,
                lineHeight: 1.4,
              }}
            >
              To connect travelers with extraordinary experiences that inspire, educate, and create lasting memories.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              Founded in 2020, TripNest has grown from a small startup to a trusted travel platform serving thousands of adventurers worldwide. We believe that travel has the power to transform lives, broaden perspectives, and create connections across cultures.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
              }}
            >
              Our team of travel experts works tirelessly to curate the best destinations, accommodations, and experiences, ensuring that every journey is not just a trip, but a life-changing adventure.
            </Typography>
          </Grid>

          {/* Centered image block */}
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
              component="img"
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"
              alt="Travel Experience"
              sx={{
                width: '100%',
                maxWidth: 500,
                height: { xs: 300, md: 400 },
                objectFit: 'cover',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                mx: 'auto',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ backgroundColor: 'white', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 6,
            }}
          >
            TripNest by the Numbers
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}
                >
                  <Box sx={{ mb: 3 }}>{stat.icon}</Box>
                  <Typography
                    variant="h2"
                    component="div"
                    color="primary"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Values Section (zig-zag layout) */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            mb: 6,
          }}
        >
          Our Core Values
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {values.map((value, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={5}
              key={idx}
              sx={{
                display: 'flex',
                justifyContent: idx % 2 === 0 ? 'flex-end' : 'flex-start',
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <Box sx={{ mb: 3 }}>{value.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  {value.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {value.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Team Section */}
      <Box sx={{ backgroundColor: 'white', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 3,
            }}
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            color="text.secondary"
            sx={{
              mb: 6,
              fontWeight: 500,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            The passionate people behind TripNest
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    sx={{
                      width: 140,
                      height: 140,
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Chip
                    label={member.role}
                    color="primary"
                    variant="outlined"
                    sx={{
                      mb: 3,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: '1rem',
                    }}
                  >
                    {member.bio}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact CTA */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 3,
            }}
          >
            Ready to Start Your Journey?
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 6,
              opacity: 0.95,
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            Join thousands of travelers who trust TripNest for their adventures
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Explore />}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              Explore Destinations
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ContactSupport />}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'grey.300',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default About;