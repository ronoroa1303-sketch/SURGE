import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  qty: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

cartSchema.methods.calculateTotal = async function () {
  let total = 0;
  await this.populate('items.product');
  this.items.forEach((item) => {
    total += item.product.price * item.qty;
  });
  return total;
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
