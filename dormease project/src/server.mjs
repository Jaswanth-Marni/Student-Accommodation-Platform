import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.mjs';
import authRoutes from './routes/auth.routes.mjs';
import bookingRoutes from './routes/bookings.routes.mjs';
import listingRoutes from './routes/listing.routes.mjs';
import favoriteRoutes from './routes/favorites.routes.mjs';
import profileRoutes from './routes/profile.routes.mjs';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

console.log('Starting server...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - simplified for debugging
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Always add CORS headers regardless of origin
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Debug endpoint to test the server without database interaction
app.get('/debug', (req, res) => {
  try {
    res.json({
      message: 'Debug endpoint working',
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mongoDbUri: process.env.MONGODB_URI ? 'Set (starts with: ' + process.env.MONGODB_URI.substring(0, 20) + '...)' : 'Not Set',
        jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not Set',
        port: process.env.PORT || 5000
      },
      headers: req.headers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Database check endpoint
app.get('/api/dbcheck', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Count documents in each collection
    const counts = {};
    for (const name of collectionNames) {
      counts[name] = await db.collection(name).countDocuments();
    }
    
    res.json({
      status: 'Connected',
      database: mongoose.connection.name,
      collections: collectionNames,
      documentCounts: counts,
      server: mongoose.connection.host,
      message: 'Database connection is working properly'
    });
  } catch (error) {
    console.error('Database check error:', error);
    res.status(500).json({ 
      status: 'Error',
      message: 'Database check failed',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    const db = await connectDB();
    console.log(`MongoDB connected to: ${db.connection.host}`);
    
    // Use environment PORT or default to 5000
    const PORT = process.env.PORT || 5000;
    // Use the machine's network IP
    const HOST = '0.0.0.0'; // This allows connections from any IP
    
    app.listen(PORT, HOST, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Server is accessible at http://192.168.251.217:${PORT}`);
      console.log(`Try accessing the health endpoint at http://192.168.251.217:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 