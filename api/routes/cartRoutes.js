const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart'); // Import the Cart model
const Product = require('../models/Product'); // Import Product model to check stock
const protect = require('../middleware/Auth'); // Middleware to protect routes

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post(
  '/add',
  protect,
  asyncHandler(async (req, res) => {
    const { productId, qty } = req.body;

    // Validate request
    if (!productId || !qty) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    // Check if the product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.countInStock < qty) {
      return res.status(400).json({ message: 'Not enough stock for the requested quantity' });
    }

    // Add to cart logic
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].qty += qty;
    } else {
      cart.items.push({
        product: productId,
        qty,
        price: product.price,
        name: product.name,
        image: product.image,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  })
);

// @desc    Get user cart items
// @route   GET /api/cart
// @access  Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image'); // Populate product details

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  })
);

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
router.delete(
  '/remove/:productId',
  protect,
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    console.log('Request to remove product with ID:', productId); // Debugging log

    if (!productId) {
      console.error('No productId provided in request'); // Debugging log
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      console.error('Cart not found for user:', req.user._id); // Debugging log
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      console.error('Item not found in cart with product ID:', productId); // Debugging log
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1); // Remove item from cart
    await cart.save();
    console.log('Item removed successfully, updated cart:', cart); // Debugging log
    res.status(200).json(cart);
  })
);

module.exports = router;
