import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price imageUrl stock'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const numericQty = Number(qty);

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const currentQty = itemIndex > -1 ? cart.items[itemIndex].qty : 0;
    const projectedQty = currentQty + numericQty;

    // Check if product.stock >= projected aggregate qty
    if (product.stock < projectedQty) {
      res.status(400);
      throw new Error('Not enough stock');
    }

    if (itemIndex > -1) {
      // Product exists, update quantity
      cart.items[itemIndex].qty = projectedQty;
    } else {
      // Product doesn't exist, add to array
      cart.items.push({ product: productId, qty: numericQty });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== req.params.productId
      );
      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};
