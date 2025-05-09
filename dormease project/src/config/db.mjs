import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Extract the MongoDB Atlas connection string
    let mongoURI = process.env.MONGODB_URI || 'mongodb+srv://your-mongodb-atlas-connection-string';
    
    // Ensure the connection string includes the database name 'test'
    if (!mongoURI.includes('/test')) {
      // If URI ends with '/', just append 'test'
      if (mongoURI.endsWith('/')) {
        mongoURI += 'test';
      } 
      // If URI doesn't have a database specified, add '/test'
      else if (!mongoURI.split('/').pop().includes('?')) {
        mongoURI += '/test';
      } 
      // If URI has query parameters but no database, insert 'test' before query params
      else if (mongoURI.includes('/?')) {
        mongoURI = mongoURI.replace('/?', '/test?');
      }
    }
    
    console.log('Connecting to MongoDB database: test');
    console.log('Connection string (masked):', mongoURI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@'));
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; 