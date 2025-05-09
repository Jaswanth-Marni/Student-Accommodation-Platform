import jwt from 'jsonwebtoken';
import { User } from '../models/User.mjs';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const ownerMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ message: 'Access denied. Landlord role required' });
    }
    next();
  } catch (error) {
    console.error('Owner middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 