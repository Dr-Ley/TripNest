import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Attractions,
  Person,
  Email,
  Phone,
  Event,
  AccessTime,
  Group,
  CheckCircle,
  Close,
  Login,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const AttractionBookingForm = ({ open, onClose, attractionData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    attraction: '',
    date: '',
    time: '',
    guests: '',
    specialRequests: '',
  });

  // Pre-fill form with user data if logged in
  React.useEffect(() => {
    if (user && attractionData) {
      // Split the user's full name into first and last name
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user, attractionData]);

  // Check if user is authenticated
  if (!user) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Authentication Required</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={4}>
            <Login sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Please Sign In to Book
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You need to be signed in to make attraction bookings. This helps us provide you with a better experience and secure your reservations.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                onClose();
                navigate('/signin');
              }}
              sx={{ mt: 2 }}
            >
              Sign In / Create Account
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const bookingData = {
        ...formData,
        attraction: attractionData?.name || formData.attraction || 'General Attraction Booking',
        attractionName: attractionData?.name || formData.attraction || 'General Attraction Booking',
        attractionLocation: attractionData?.location || 'Not specified',
        bookingType: 'attraction',
        bookingDate: new Date().toISOString(),
        status: 'pending',
      };

      console.log('Submitting attraction booking:', bookingData);

      const response = await fetch('/api/bookings/attraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Booking successful:', result);
        
        // Add to cart when booking is confirmed
        if (attractionData) {
          const cartItem = {
            id: `${attractionData.id}-${Date.now()}`, // Unique ID for cart item
            name: attractionData.name,
            type: 'attraction',
            price: attractionData.price || 30, // Default price if not provided
            image: attractionData.image || '/images/dest.jpg',
            location: attractionData.location,
            date: formData.date,
            time: formData.time,
            guests: formData.guests,
            bookingDate: formData.date,
            quantity: 1,
          };
          addToCart(cartItem);
        }

        setShowSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          attraction: '',
          date: '',
          time: '',
          guests: '',
          specialRequests: '',
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Booking failed with status:', response.status);
        console.error('Error data:', errorData);
        throw new Error(`Booking failed: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            maxHeight: isMobile ? '100%' : '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #00aa6c 0%, #008c5a 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Attractions />
            <Typography variant="h6" component="span">
              Attraction Booking
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'white' }}
            disabled={loading}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          {attractionData && (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'grey.50',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {attractionData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {attractionData.location}
              </Typography>
            </Paper>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Person />
              Personal Information
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name *"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="E-mail *"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="example@example.com"
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'grey.500' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone *"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'grey.500' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Attraction Details */}
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Attractions />
              Attraction Details
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {!attractionData && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Attraction Name *"
                    value={formData.attraction}
                    onChange={handleInputChange('attraction')}
                    placeholder="e.g. Eiffel Tower"
                    required
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date *"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange('date')}
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <Event sx={{ mr: 1, color: 'grey.500' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time *"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange('time')}
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <AccessTime sx={{ mr: 1, color: 'grey.500' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Number of Guests *</InputLabel>
                  <Select
                    value={formData.guests}
                    label="Number of Guests *"
                    onChange={handleInputChange('guests')}
                    startAdornment={<Group sx={{ mr: 1, color: 'grey.500' }} />}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">Select number of guests</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="5">5</MenuItem>
                    <MenuItem value="6">6</MenuItem>
                    <MenuItem value="7">7</MenuItem>
                    <MenuItem value="8">8+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Special Requests */}
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                mb: 3,
              }}
            >
              Special Requests
            </Typography>

            <TextField
              fullWidth
              label="Any special requests?"
              multiline
              rows={4}
              value={formData.specialRequests}
              onChange={handleInputChange('specialRequests')}
              placeholder="Please let us know if you have any special requirements, accessibility needs, or requests..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                mb: 3,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              px: 3,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&:disabled': {
                backgroundColor: theme.palette.primary.main,
                opacity: 0.7,
              },
            }}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: '100%' }}
        >
          Attraction booking submitted successfully! We'll contact you soon to confirm your reservation.
        </Alert>
      </Snackbar>
    </>
  );
};

export default AttractionBookingForm; 