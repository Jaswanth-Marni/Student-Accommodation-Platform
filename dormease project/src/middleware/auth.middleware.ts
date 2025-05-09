import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  userType: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is an owner
export const ownerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.userType !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Owner privileges required.' });
  }
  next();
};

// Middleware to check if user is a student
export const studentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.userType !== 'student') {
    return res.status(403).json({ message: 'Access denied. Student privileges required.' });
  }
  next();
}; 