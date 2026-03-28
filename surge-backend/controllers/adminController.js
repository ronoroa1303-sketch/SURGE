import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // e.g., 'shipped', 'delivered'
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get basic analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res, next) => {
  try {
    const orders = await Order.find({ isPaid: true });
    
    // Total Revenue
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    
    // Total Orders
    const totalOrders = orders.length;

    // Optional: Top Selling Product Logic (Simplistic)
    // Flatten all items across all paid orders to count qty
    const productCounts = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if(productCounts[item.name]) {
          productCounts[item.name] += item.qty;
        } else {
          productCounts[item.name] = item.qty;
        }
      });
    });

    let topSellingProduct = { name: 'N/A', qty: 0 };
    for (const [name, qty] of Object.entries(productCounts)) {
      if (qty > topSellingProduct.qty) {
        topSellingProduct = { name, qty };
      }
    }

    res.json({
      totalRevenue,
      totalOrders,
      topSellingProduct
    });

  } catch (error) {
    next(error);
  }
};
