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
  FormControlLabel,
  Radio,
  RadioGroup,
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
  Restaurant as RestaurantIcon,
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

const RestaurantBookingForm = ({ open, onClose, restaurantData }) => {
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
    guests: '',
    reservationDate: '',
    reservationTime: '',
    reservationType: '',
    specialRequests: '',
  });

  // Pre-fill form with user data if logged in
  React.useEffect(() => {
    if (user && restaurantData) {
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
  }, [user, restaurantData]);

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
              You need to be signed in to make restaurant reservations. This helps us provide you with a better experience and secure your bookings.
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
        restaurantName: restaurantData?.name || 'General Restaurant Booking',
        restaurantLocation: restaurantData?.location || 'Not specified',
        bookingType: 'restaurant',
        bookingDate: new Date().toISOString(),
        status: 'pending',
      };

      console.log('Submitting restaurant booking:', bookingData);

      const response = await fetch('/api/bookings/restaurant', {
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
        if (restaurantData) {
          const cartItem = {
            id: `${restaurantData.id}-${Date.now()}`, // Unique ID for cart item
            name: restaurantData.name,
            type: 'restaurant',
            price: restaurantData.price || 50, // Default price if not provided
            image: restaurantData.image || '/images/drest.jpg',
            location: restaurantData.location,
            reservationDate: formData.reservationDate,
            reservationTime: formData.reservationTime,
            reservationType: formData.reservationType,
            guests: formData.guests,
            bookingDate: formData.reservationDate,
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
          guests: '',
          reservationDate: '',
          reservationTime: '',
          reservationType: '',
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
            <RestaurantIcon />
            <Typography variant="h6" component="span">
              Restaurant Table Booking
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
          {restaurantData && (
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
                {restaurantData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {restaurantData.location}
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

            {/* Reservation Details */}
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
              <Event />
              Reservation Details
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel># of Guests *</InputLabel>
                  <Select
                    value={formData.guests}
                    label="# of Guests *"
                    onChange={handleInputChange('guests')}
                    startAdornment={<Group sx={{ mr: 1, color: 'grey.500' }} />}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">Select number of guests</MenuItem>
                    <MenuItem value="1">1 Guest</MenuItem>
                    <MenuItem value="2">2 Guests</MenuItem>
                    <MenuItem value="3">3 Guests</MenuItem>
                    <MenuItem value="4">4 Guests</MenuItem>
                    <MenuItem value="5">5 Guests</MenuItem>
                    <MenuItem value="6">6 Guests</MenuItem>
                    <MenuItem value="7">7 Guests</MenuItem>
                    <MenuItem value="8">8+ Guests</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reservation Date *"
                  type="date"
                  value={formData.reservationDate}
                  onChange={handleInputChange('reservationDate')}
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
                  label="Reservation Time *"
                  type="time"
                  value={formData.reservationTime}
                  onChange={handleInputChange('reservationTime')}
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
            </Grid>

            {/* Reservation Type */}
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
              <RestaurantIcon />
              Reservation Type
            </Typography>

            <FormControl component="fieldset" required sx={{ mb: 4 }}>
              <RadioGroup
                value={formData.reservationType}
                onChange={handleInputChange('reservationType')}
                sx={{
                  '& .MuiFormControlLabel-root': {
                    margin: '8px 0',
                    padding: '12px 16px',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    '&:hover': {
                      backgroundColor: 'grey.50',
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-checked': {
                      backgroundColor: 'rgba(0, 170, 108, 0.05)',
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <FormControlLabel
                  value="Dinner"
                  control={<Radio color="primary" />}
                  label="Dinner"
                />
                <FormControlLabel
                  value="VIP/Mezzanine"
                  control={<Radio color="primary" />}
                  label="VIP/Mezzanine"
                />
                <FormControlLabel
                  value="Birthday/Anniversary"
                  control={<Radio color="primary" />}
                  label="Birthday/Anniversary"
                />
                <FormControlLabel
                  value="Nightlife"
                  control={<Radio color="primary" />}
                  label="Nightlife"
                />
              </RadioGroup>
            </FormControl>

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
              placeholder="Please let us know if you have any special requirements, dietary restrictions, or requests..."
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
            {loading ? 'Processing...' : 'Confirm Reservation'}
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
          Restaurant reservation submitted successfully! We'll contact you soon to confirm your booking.
        </Alert>
      </Snackbar>
    </>
  );
};

export default RestaurantBookingForm; 