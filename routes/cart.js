const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/cart
// @desc    Get user's cart from session
// @access  Private
router.get('/', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const cart = req.session.cart || [];
  res.json(cart);
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { productId, quantity = 1 } = req.body;

    // Check if product exists and has sufficient quantity
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Check if item already exists in cart
    const existingItemIndex = req.session.cart.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      req.session.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      req.session.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        total: product.price * quantity
      });
    }

    // Update totals
    req.session.cart.forEach(item => {
      item.total = item.price * item.quantity;
    });

    res.json({ 
      message: 'Item added to cart successfully', 
      cart: req.session.cart 
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});

// @route   PUT /api/cart/update/:productId
// @desc    Update item quantity in cart
// @access  Private
router.put('/update/:productId', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!req.session.cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    const itemIndex = req.session.cart.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check if product has sufficient quantity
    const product = await Product.findById(productId);
    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    // Update quantity
    req.session.cart[itemIndex].quantity = quantity;
    req.session.cart[itemIndex].total = product.price * quantity;

    res.json({ 
      message: 'Cart updated successfully', 
      cart: req.session.cart 
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:productId', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { productId } = req.params;

    if (!req.session.cart) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    req.session.cart = req.session.cart.filter(
      item => item.productId.toString() !== productId
    );

    res.json({ 
      message: 'Item removed from cart successfully', 
      cart: req.session.cart 
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});

// @route   POST /api/cart/checkout
// @desc    Checkout cart and reduce product quantities
// @access  Private
router.post('/checkout', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const cart = req.session.cart;
    const checkoutResults = [];

    // Process each item in cart
    for (const item of cart) {
      try {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          checkoutResults.push({
            productId: item.productId,
            success: false,
            message: 'Product not found'
          });
          continue;
        }

        if (product.quantity < item.quantity) {
          checkoutResults.push({
            productId: item.productId,
            success: false,
            message: `Insufficient quantity. Available: ${product.quantity}`
          });
          continue;
        }

        // Reduce product quantity
        await product.reduceQuantity(item.quantity);

        checkoutResults.push({
          productId: item.productId,
          success: true,
          message: 'Quantity reduced successfully',
          newQuantity: product.quantity
        });
      } catch (error) {
        checkoutResults.push({
          productId: item.productId,
          success: false,
          message: 'Error processing item'
        });
      }
    }

    // Clear cart after successful checkout
    req.session.cart = [];

    res.json({
      message: 'Checkout completed',
      results: checkoutResults,
      cart: req.session.cart
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Error during checkout' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  req.session.cart = [];
  res.json({ message: 'Cart cleared successfully' });
});

module.exports = router; 