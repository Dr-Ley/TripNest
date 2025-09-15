import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
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
  Hotel,
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

const HotelBookingForm = ({ open, onClose, hotelData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Debug logging
  console.log('HotelBookingForm props:', { open, hotelData });
  console.log('Current user:', user);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    roomType: '',
    specialRequests: '',
  });

  // Pre-fill form with user data if logged in
  React.useEffect(() => {
    if (user && hotelData) {
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
  }, [user, hotelData]);

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
              You need to be signed in to make hotel bookings. This helps us provide you with a better experience and secure your reservations.
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
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.checkIn || !formData.checkOut) {
        throw new Error('Please select check-in and check-out dates');
      }

      if (!formData.guests || !formData.roomType) {
        throw new Error('Please select number of guests and room type');
      }

      // Validate dates
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        throw new Error('Check-in date cannot be in the past');
      }

      if (checkOutDate <= checkInDate) {
        throw new Error('Check-out date must be after check-in date');
      }

      const bookingData = {
        ...formData,
        hotelName: hotelData?.name || 'General Hotel Booking',
        hotelLocation: hotelData?.location || 'Not specified',
        bookingType: 'hotel',
        bookingDate: new Date().toISOString(),
        status: 'pending',
        productId: hotelData?.id, // Include product ID for quantity management
        totalPrice: hotelData?.price || 0,
      };

      console.log('Submitting hotel booking:', bookingData);

      const response = await fetch('/api/bookings/hotel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookies
        body: JSON.stringify(bookingData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Booking successful:', result);
        
        // Add to cart when booking is confirmed
        if (hotelData) {
          const cartItem = {
            id: `${hotelData.id}-${Date.now()}`, // Unique ID for cart item
            name: hotelData.name,
            type: 'hotel',
            price: hotelData.price,
            image: hotelData.image,
            location: hotelData.location,
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            roomType: formData.roomType,
            guests: formData.guests,
            bookingDate: formData.checkIn,
            quantity: 1,
          };
          addToCart(cartItem);
        }

        setShowSuccess(true);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          checkIn: '',
          checkOut: '',
          guests: '',
          roomType: '',
          specialRequests: '',
        });
        
        // Close form after success
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Booking failed with status:', response.status);
        console.error('Error data:', errorData);
        throw new Error(errorData.message || `Booking failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
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
            <Hotel />
            <Typography variant="h6" component="span">
              Hotel Booking
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
          {hotelData && (
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
                {hotelData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hotelData.location}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                ${hotelData.price}/night
              </Typography>
            </Paper>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* User Info Alert */}
          {user && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Welcome back, {user.username}! Your information has been pre-filled.
            </Alert>
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

            {/* Booking Details */}
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
              <Hotel />
              Booking Details
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Check-in Date *"
                  type="date"
                  value={formData.checkIn}
                  onChange={handleInputChange('checkIn')}
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
                  label="Check-out Date *"
                  type="date"
                  value={formData.checkOut}
                  onChange={handleInputChange('checkOut')}
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
                    <MenuItem value="1">1 Guest</MenuItem>
                    <MenuItem value="2">2 Guests</MenuItem>
                    <MenuItem value="3">3 Guests</MenuItem>
                    <MenuItem value="4">4 Guests</MenuItem>
                    <MenuItem value="5">5 Guests</MenuItem>
                    <MenuItem value="6">6+ Guests</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Room Type *</InputLabel>
                  <Select
                    value={formData.roomType}
                    label="Room Type *"
                    onChange={handleInputChange('roomType')}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">Select room type</MenuItem>
                    <MenuItem value="Standard">Standard Room</MenuItem>
                    <MenuItem value="Deluxe">Deluxe Room</MenuItem>
                    <MenuItem value="Suite">Suite</MenuItem>
                    <MenuItem value="Executive">Executive Room</MenuItem>
                    <MenuItem value="Presidential">Presidential Suite</MenuItem>
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
          🎉 Hotel booking confirmed successfully! 
          {hotelData && ` Your reservation for ${hotelData.name} has been saved to the database.`}
          We'll contact you soon to confirm your reservation.
        </Alert>
      </Snackbar>
    </>
  );
};

export default HotelBookingForm; 