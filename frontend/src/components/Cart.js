import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Payment,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateQuantity(itemId, newQuantity);
      
      setSuccessMessage('Quantity updated successfully');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      removeFromCart(itemId);
      
      setSuccessMessage('Item removed from cart');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(false);
    }
  };

  const calculateSubtotal = () => {
    return getCartTotal();
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.15; // 15% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setSuccessMessage('Your cart is empty');
      setShowSuccess(true);
      return;
    }
    
    // Navigate to payment page
    navigate('/payment', { 
      state: { 
        cartItems, 
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal()
      } 
    });
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  // When cart is empty, show the empty state below instead of a spinner

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCart sx={{ mr: 2, color: 'primary.main' }} />
            Shopping Cart
          </Typography>
        </Box>

        {cartItems.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingCart sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              No orders yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add some amazing destinations to your cart to get started!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/hotel-reservation')}
              startIcon={<ShoppingCart />}
            >
              Browse Hotels
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Cart Items ({cartItems.length})
              </Typography>
              
              {cartItems.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.roomType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.checkIn} - {item.checkOut}
                        </Typography>
                        <Chip
                          label={item.type}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="primary" gutterBottom>
                            ${item.price}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updating}
                            >
                              <Remove />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0) {
                                  handleUpdateQuantity(item.id, value);
                                }
                              }}
                              sx={{ width: '60px', mx: 1 }}
                              inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updating}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                          
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updating}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Subtotal:</Typography>
                      <Typography>${calculateSubtotal().toFixed(2)}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Tax (15%):</Typography>
                      <Typography>${calculateTax().toFixed(2)}</Typography>
                    </Box>
                    
                    <Divider />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6" color="primary">
                        ${calculateTotal().toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleCheckout}
                    startIcon={<Payment />}
                    sx={{ mt: 3 }}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSuccess} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Cart; 