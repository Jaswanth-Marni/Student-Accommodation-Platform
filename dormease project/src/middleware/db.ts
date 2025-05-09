import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';

const withDB = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();
    return handler(req, res);
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ error: 'Database connection error' });
  }
};

export default withDB; 