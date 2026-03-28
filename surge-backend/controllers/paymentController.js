import crypto from 'crypto';
import razorpayInstance from '../config/razorpay.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import sendEmail from '../utils/emailHelper.js';

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized for this order');
    }

    if (order.isPaid === true) {
      res.status(400);
      throw new Error('Order already paid');
    }

    // Razorpay amount is in paise (₹1 = 100 paise)
    const options = {
      amount: order.totalPrice * 100, 
      currency: "INR",
      receipt: `receipt_order_${order._id}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    if (!razorpayOrder) {
      res.status(500);
      throw new Error('Some error occurred while creating Razorpay order');
    }

    // Create a Payment log
    await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: order.totalPrice,
      razorpayOrderId: razorpayOrder.id,
      status: 'created'
    });

    res.json(razorpayOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId 
    } = req.body;

    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized for this order');
    }

    if (order.isPaid === true) {
      res.status(400);
      throw new Error('Order already paid');
    }

    // Creating our own signature to compare with Razorpay's
    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature;

    if (isAuthentic) {
      // Find the payment log and update it
      const paymentLog = await Payment.findOne({ razorpayOrderId });
      if (paymentLog) {
        paymentLog.razorpayPaymentId = razorpayPaymentId;
        paymentLog.razorpaySignature = razorpaySignature;
        paymentLog.status = 'paid';
        await paymentLog.save();
      }

      // Update the Order status
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentId = razorpayPaymentId;
        order.paymentStatus = 'captured';
        order.status = 'paid'; // Automatically update status to paid
        await order.save();

        // Bonus: Send Email Notification
        const emailBody = `
          <h1>Payment Successful!</h1>
          <p>Hi ${order.user.name},</p>
          <p>We have successfully received your payment of ₹${order.totalPrice} for Order ID: ${order._id}.</p>
          <p>Your SURGE Protein Snacks will be shipped soon!</p>
        `;
        await sendEmail({
          email: order.user.email,
          subject: 'SURGE - Payment Successful',
          html: emailBody
        });
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400);
      throw new Error('Payment verification failed');
    }
  } catch (error) {
    next(error);
  }
};
