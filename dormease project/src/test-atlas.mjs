import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-mongodb-atlas-connection-string';

async function testAtlasConnection() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log(`Connection string: ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')}`);
    
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`Connected to database: ${conn.connection.name}`);
    console.log(`Host: ${conn.connection.host}`);
    
    // List collections
    console.log('\nAvailable collections:');
    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('No collections found. Database is empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Create a test document
    console.log('\nCreating a test document...');
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const Test = mongoose.models.Test || mongoose.model('Test', testSchema);
    
    const result = await Test.create({ name: 'Test Connection' });
    console.log(`✅ Test document created with ID: ${result._id}`);
    
    // Clean up test document
    await Test.deleteOne({ _id: result._id });
    console.log('✅ Test document deleted');
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB Atlas:');
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB Atlas');
    process.exit();
  }
}

testAtlasConnection(); 