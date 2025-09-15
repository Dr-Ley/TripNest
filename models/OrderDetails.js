const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', 
    required: true 
  },
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item', 
    required: true 
  },
  qty: { 
    type: Number, 
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
orderDetailSchema.index({ orderId: 1 });
orderDetailSchema.index({ itemId: 1 });

module.exports = mongoose.model('OrderDetail', orderDetailSchema);