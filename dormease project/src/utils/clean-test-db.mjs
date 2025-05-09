import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const cleanTestDatabase = async () => {
  try {
    console.log('Test Database Cleanup Utility');
    console.log('--------------------------');
    
    // Get the MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('Error: MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`Connected to database: ${mongoose.connection.name}`);
    
    // Get database reference
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('Current collections in database:', collectionNames);
    
    // Check for inconsistent collection names
    const requiredCollections = ['favorites', 'profiles', 'bookings'];
    
    // Create a mapping of alternate names that might exist to the required names
    const collectionMappings = {
      'favorite': 'favorites',
      'profile': 'profiles',
      'booking': 'bookings',
      'Favorites': 'favorites',
      'Profiles': 'profiles',
      'Bookings': 'bookings'
    };
    
    for (const [altName, correctName] of Object.entries(collectionMappings)) {
      if (collectionNames.includes(altName) && !collectionNames.includes(correctName)) {
        console.log(`Found collection "${altName}" that should be named "${correctName}". Renaming...`);
        
        // Rename the collection
        try {
          await db.collection(altName).rename(correctName);
          console.log(`Successfully renamed "${altName}" to "${correctName}"`);
        } catch (renameError) {
          console.error(`Error renaming collection: ${renameError.message}`);
        }
      }
    }
    
    // Create missing required collections
    for (const collectionName of requiredCollections) {
      if (!collectionNames.includes(collectionName)) {
        console.log(`Required collection "${collectionName}" is missing. Creating...`);
        
        try {
          await db.createCollection(collectionName);
          console.log(`Successfully created collection "${collectionName}"`);
        } catch (createError) {
          console.error(`Error creating collection: ${createError.message}`);
        }
      }
    }
    
    // Verify final collection list
    const updatedCollections = await db.listCollections().toArray();
    const updatedNames = updatedCollections.map(c => c.name);
    
    console.log('Updated collections in database:', updatedNames);
    
    console.log('\nDatabase cleanup completed!');
  } catch (error) {
    console.error('Database cleanup error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

cleanTestDatabase(); 