import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  IconButton,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard,
  AccountBalance,
  CheckCircle,
  ArrowBack,
  Receipt,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, subtotal, tax, total } = location.state || {};
  const { clearCart } = useCart();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const steps = ['Review Order', 'Payment Details', 'Confirmation'];

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate order creation
      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        items: cartItems,
        subtotal,
        tax,
        total,
        paymentMethod,
        orderDate: new Date().toISOString(),
        status: 'confirmed',
      };

      // Save order to localStorage for demo purposes
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart after successful payment
      clearCart();

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/order-history');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Review
            </Typography>
            {cartItems?.map((item) => (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.location} • {item.roomType}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.checkIn} - {item.checkOut}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle1" color="primary">
                        ${item.price}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1">
                Subtotal: ${subtotal?.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Tax: ${tax?.toFixed(2)}
              </Typography>
              <Typography variant="h6" color="primary">
                Total: ${total?.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Select Payment Method</FormLabel>
              <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCard sx={{ mr: 1 }} />
                      Credit/Debit Card
                    </Box>
                  }
                />
                <FormControlLabel
                  value="bank"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalance sx={{ mr: 1 }} />
                      Bank Transfer
                    </Box>
                  }
                />
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PaymentIcon sx={{ mr: 1 }} />
                      PayPal
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'card' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={formData.cardHolder}
                    onChange={handleInputChange('cardHolder')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    value={formData.expiryDate}
                    onChange={handleInputChange('expiryDate')}
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    value={formData.cvv}
                    onChange={handleInputChange('cvv')}
                    placeholder="123"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Billing Address"
                    value={formData.billingAddress}
                    onChange={handleInputChange('billingAddress')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={handleInputChange('city')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.state}
                    onChange={handleInputChange('state')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange('zipCode')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={formData.country}
                    onChange={handleInputChange('country')}
                  />
                </Grid>
              </Grid>
            )}

            {paymentMethod === 'bank' && (
              <Alert severity="info">
                You will receive bank transfer details after order confirmation.
              </Alert>
            )}

            {paymentMethod === 'paypal' && (
              <Alert severity="info">
                You will be redirected to PayPal for payment after order confirmation.
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your order has been confirmed and payment has been processed successfully.
            </Typography>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Receipt />}
            >
              {loading ? 'Processing...' : 'View Order History'}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  if (!cartItems) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          No cart items found. Please return to your cart.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/cart')}
          sx={{ mt: 2 }}
        >
          Return to Cart
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate('/cart')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
                     <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
             <PaymentIcon sx={{ mr: 2, color: 'primary.main' }} />
             Checkout
           </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Paper sx={{ p: 3, mb: 3 }}>
          {renderStepContent(activeStep)}
        </Paper>

        {/* Navigation Buttons */}
        {activeStep < steps.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
            >
              {activeStep === steps.length - 2 ? 'Complete Payment' : 'Next'}
            </Button>
          </Box>
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSuccess} severity="success">
            Order placed successfully! Redirecting to order history...
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default PaymentPage; 