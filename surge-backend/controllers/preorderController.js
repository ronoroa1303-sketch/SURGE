import Preorder from '../models/Preorder.js';

export const createPreorder = async (req, res, next) => {
  try {
    const { name, email, quantity } = req.body;
    
    const exists = await Preorder.findOne({ email });
    if (exists) {
      res.status(400);
      return next(new Error('This email has already been registered for a pre-order.'));
    }

    const preorder = await Preorder.create({ name, email, quantity });
    res.status(201).json(preorder);
  } catch (error) {
    next(error);
  }
};
