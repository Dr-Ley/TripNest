const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products or filter by category
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    console.log('🔍 API Request - Query params:', req.query);
    console.log('🔍 Category filter:', category);
    
    // If category is specified, filter by it
    if (category) {
      query.category = category;
      console.log('🔍 Applied category filter:', query);
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    console.log(`🔍 Found ${products.length} products for category: ${category || 'all'}`);
    products.forEach(p => console.log(`  - ${p.name} (${p.category})`));
    
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      category,
      image,
      location
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      image,
      location
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// @route   POST /api/products/:id/reduce-quantity
// @desc    Reduce product quantity when purchased
// @access  Private
router.post('/:id/reduce-quantity', async (req, res) => {
  try {
    const { amount } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < amount) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    // Use the method to reduce quantity
    await product.reduceQuantity(amount);

    res.json({ 
      message: 'Quantity reduced successfully', 
      product,
      newQuantity: product.quantity 
    });
  } catch (error) {
    console.error('Reduce quantity error:', error);
    res.status(500).json({ message: 'Error reducing quantity' });
  }
});

// @route   POST /api/products/:id/add-quantity
// @desc    Add product quantity (admin function)
// @access  Private (Admin)
router.post('/:id/add-quantity', async (req, res) => {
  try {
    const { amount } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Use the method to add quantity
    await product.addQuantity(amount);

    res.json({ 
      message: 'Quantity added successfully', 
      product,
      newQuantity: product.quantity 
    });
  } catch (error) {
    console.error('Add quantity error:', error);
    res.status(500).json({ message: 'Error adding quantity' });
  }
});

module.exports = router; 