const Cart = require('../models/Cart');
exports.addToCart = async (req, res) => {
const { userId, itemId, qty } = req.body;
try {
// Create a new cart item
const cartItem = new Cart({
userId,
itemId,
qty
// ordered is false by default as defined in the model
});
// Save the cart item to the database
const result = await cartItem.save();
// Respond with the cart item ID and success
message
res.status(201).json({ cartId: result._id,
message: 'Item added to cart' });
} catch (error) {
    // Handle errors, like missing fields or invalid IDs
res.status(500).json({ message: 'Error adding to cart' });
}
};
exports.showCart = async (req, res) => {
const { userId } = req.params;
try {
// Retrieve all non-ordered cart items for the user
const cartItems = await Cart.find({ userId,
ordered: false });
// Respond with the user's cart items
res.status(200).json(cartItems);
} catch (error) {
// Handle potential errors
res.status(500).json({ message: 'Error retrieving cart items' });
}
};
