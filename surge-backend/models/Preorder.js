import mongoose from 'mongoose';

const preorderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const Preorder = mongoose.model('Preorder', preorderSchema);
export default Preorder;
