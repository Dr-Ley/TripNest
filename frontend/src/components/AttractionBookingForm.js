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

/*  ➜  NEW IMPORT  */
import { createBooking } from '../api/bookings';

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

  /*  pre-fill logic  */
  React.useEffect(() => {
    if (user && attractionData) {
      const nameParts = (user.name || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user, attractionData]);

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
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingPayload = {
        bookingType: 'attraction',
        attractionName: attractionData?.name || 'General Attraction Booking',
        attractionLocation: attractionData?.location || 'Not specified',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        specialRequests: formData.specialRequests,
        price: attractionData?.price || 30,
        productId: attractionData?.id,
        status: 'pending',
        bookingDate: new Date().toISOString(),
      };

      /*  ➜  NEW API CALL  */
      await createBooking(bookingPayload);

      /*  ➜  SUCCESS HANDLING  */
      if (attractionData) {
        addToCart({
          id: `${attractionData.id}-${Date.now()}`,
          name: attractionData.name,
          type: 'attraction',
          price: attractionData.price || 30,
          image: attractionData.image || '/images/dest.jpg',
          location: attractionData.location,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          bookingDate: formData.date,
          quantity: 1,
        });
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
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => setShowSuccess(false);
  const handleClose = () => {
    if (!loading) onClose();
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
            <Attractions />
            <Typography variant="h6">Attraction Booking</Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'white' }} disabled={loading}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          {attractionData && (
            <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" fontWeight="bold">
                {attractionData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {attractionData.location}
              </Typography>
            </Paper>
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
              <Attractions sx={{ verticalAlign: 'middle', mr: 1 }} />
              Booking Details
            </Typography>
            <Grid container spacing={3} mb={4}>
              {!attractionData && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Attraction Name"
                    value={formData.attraction}
                    onChange={handleInputChange('attraction')}
                    placeholder="e.g. Eiffel Tower"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange('date')}
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
                  label="Time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange('time')}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <AccessTime sx={{ mr: 1, color: 'grey.500' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Number of Guests</InputLabel>
                  <Select
                    value={formData.guests}
                    label="Number of Guests"
                    onChange={handleInputChange('guests')}
                    startAdornment={<Group sx={{ mr: 1, color: 'grey.500' }} />}
                  >
                    <MenuItem value="">Select</MenuItem>
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
          Attraction booking submitted successfully! We'll contact you soon to confirm your reservation.
        </Alert>
      </Snackbar>
    </>
  );
};

export default AttractionBookingForm;