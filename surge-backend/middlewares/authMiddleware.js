import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      res.status(401);
      return next(new Error('Not authorized, no token'));
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      return next(new Error('Not authorized, user no longer exists'));
    }

    // Attach user to request, excluding password
    req.user = user;
    return next();
  } catch (error) {
    res.status(401);
    return next(new Error('Not authorized, token failed'));
  }
};

// Middleware to protect routes that require admin role
export const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    return next(new Error('Not authorized as an admin'));
  }
  
  return next();
};
