import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/order
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      return next(new Error('No order items'));
    }

    // Extract product IDs
    const productIds = orderItems.map((item) => item.product);

    // Fetch real product data from DB
    const products = await Product.find({ _id: { $in: productIds } });

    const processedOrderItems = [];
    let itemsPrice = 0;
    const decrementedProducts = [];

    // Inner try-catch for rolling back atomic stock updates entirely if ANY product iteration fails
    try {
      for (const item of orderItems) {
        const qty = Number(item.qty);

        if (!qty || qty <= 0) {
          res.status(400);
          throw new Error('Invalid quantity');
        }

        const dbProduct = products.find(
          (p) => p._id.toString() === item.product.toString()
        );

        if (!dbProduct) {
          res.status(400);
          throw new Error(`Product not found: ${item.product}`);
        }

        // Apply atomic stock update avoiding race condition
        const result = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { new: true }
        );

        if (!result) {
          res.status(400);
          throw new Error(`Not enough stock for product ${dbProduct.name}`);
        }

        // Track decrements for potential multi-item rollback
        decrementedProducts.push({ productId: item.product, qty });

        // Calculate itemsPrice on server
        itemsPrice += dbProduct.price * qty;

        // Populate orderItems using DB data exclusively
        processedOrderItems.push({
          name: dbProduct.name,
          qty,
          image: dbProduct.imageUrl || dbProduct.image,
          price: dbProduct.price,
          product: dbProduct._id,
        });
      }
    } catch (innerError) {
      // Revert previous stock updates if current throws an exception
      for (const dec of decrementedProducts) {
        await Product.updateOne(
          { _id: dec.productId },
          { $inc: { stock: dec.qty } }
        );
      }
      throw innerError;
    }

    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const shippingPrice = itemsPrice > 500 ? 0 : 40;
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    const order = new Order({
      user: req.user._id,
      orderItems: processedOrderItems,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Empty the cart after successful order creation
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/order/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (order) {
      // Allow only the owner or an admin to access the order details
      if(order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to view this order');
      }
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/order/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
