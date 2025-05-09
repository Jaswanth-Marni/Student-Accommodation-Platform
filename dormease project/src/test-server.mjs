// Simple Express server for testing
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable CORS for all requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Ensure CORS headers are set
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Test endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Test server is running' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request received');
  res.json({ 
    success: true, 
    token: 'test-token', 
    user: { id: '123', email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'student' }
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register request received');
  res.json({ 
    success: true, 
    token: 'test-token', 
    user: { id: '123', email: 'test@example.com', firstName: 'Test', lastName: 'User', role: 'student' }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/health`);
}); 