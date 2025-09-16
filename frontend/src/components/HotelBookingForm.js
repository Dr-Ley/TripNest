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

/*  ➜  NEW IMPORT  */
import { createBooking } from '../api/bookings';

const HotelBookingForm = ({ open, onClose, hotelData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

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

  /*  pre-fill logic  */
  React.useEffect(() => {
    if (user && hotelData) {
      const nameParts = (user.name || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user, hotelData]);

  /*  auth-gate  */
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
    setFormData({ ...formData, [field]: event.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      /*  ➜  VALIDATION  */
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone)
        throw new Error('Please fill in all required fields');
      if (!formData.checkIn || !formData.checkOut)
        throw new Error('Please select check-in and check-out dates');
      if (!formData.guests || !formData.roomType)
        throw new Error('Please select number of guests and room type');

      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkInDate < today) throw new Error('Check-in date cannot be in the past');
      if (checkOutDate <= checkInDate)
        throw new Error('Check-out date must be after check-in date');

      /*  ➜  BUILD PAYLOAD  */
      const bookingPayload = {
        bookingType: 'hotel',
        hotelName: hotelData?.name || 'General Hotel Booking',
        hotelLocation: hotelData?.location || 'Not specified',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        roomType: formData.roomType,
        specialRequests: formData.specialRequests,
        totalPrice: hotelData?.price || 0,
        productId: hotelData?.id,
        status: 'pending',
        bookingDate: new Date().toISOString(),
      };

      /*  ➜  NEW API CALL  */
      await createBooking(bookingPayload);

      /*  ➜  SUCCESS HANDLING  */
      if (hotelData) {
        addToCart({
          id: `${hotelData.id}-${Date.now()}`,
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
        });
      }

      setShowSuccess(true);
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
      setTimeout(() => onClose(), 3000);
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => setShowSuccess(false);
  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  /*  ➜  UI  */
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { borderRadius: isMobile ? 0 : 3, maxHeight: isMobile ? '100%' : '90vh' },
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
            <Typography variant="h6">Hotel Booking</Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'white' }} disabled={loading}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          {hotelData && (
            <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" fontWeight="bold">
                {hotelData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hotelData.location}
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="bold" mt={1}>
                ${hotelData.price}/night
              </Typography>
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {user && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Welcome back, {user.username}! Your information has been pre-filled.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/*  PERSONAL INFO  */}
            <Typography variant="h5" fontWeight="bold" color="primary.main" mb={2}>
              <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
              Personal Information
            </Typography>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'grey.500' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'grey.500' }} />,
                  }}
                />
              </Grid>
            </Grid>

            {/*  BOOKING DETAILS  */}
            <Typography variant="h5" fontWeight="bold" color="primary.main" mb={2}>
              <Hotel sx={{ verticalAlign: 'middle', mr: 1 }} />
              Booking Details
            </Typography>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Check-in Date"
                  type="date"
                  value={formData.checkIn}
                  onChange={handleInputChange('checkIn')}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <Event sx={{ mr: 1, color: 'grey.500' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Check-out Date"
                  type="date"
                  value={formData.checkOut}
                  onChange={handleInputChange('checkOut')}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <Event sx={{ mr: 1, color: 'grey.500' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel># of Guests</InputLabel>
                  <Select
                    value={formData.guests}
                    label="# of Guests"
                    onChange={handleInputChange('guests')}
                    startAdornment={<Group sx={{ mr: 1, color: 'grey.500' }} />}
                  >
                    <MenuItem value="">Select</MenuItem>
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
                  <InputLabel>Room Type</InputLabel>
                  <Select
                    value={formData.roomType}
                    label="Room Type"
                    onChange={handleInputChange('roomType')}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Standard">Standard Room</MenuItem>
                    <MenuItem value="Deluxe">Deluxe Room</MenuItem>
                    <MenuItem value="Suite">Suite</MenuItem>
                    <MenuItem value="Executive">Executive Room</MenuItem>
                    <MenuItem value="Presidential">Presidential Suite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/*  SPECIAL REQUESTS  */}
            <Typography variant="h5" fontWeight="bold" color="primary.main" mb={2}>
              Special Requests
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Any special requests?"
              placeholder="Accessibility needs, celebrations, etc."
              value={formData.specialRequests}
              onChange={handleInputChange('specialRequests')}
              sx={{ mb: 3 }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
          <Button onClick={handleClose} disabled={loading} sx={{ mr: 2 }}>
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
              '&:hover': { backgroundColor: theme.palette.primary.dark },
              '&:disabled': { backgroundColor: theme.palette.primary.main, opacity: 0.7 },
            }}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          🎉 Hotel booking confirmed successfully!
          {hotelData && ` Your reservation for ${hotelData.name} has been saved.`}
          We'll contact you soon.
        </Alert>
      </Snackbar>
    </>
  );
};

export default HotelBookingForm;