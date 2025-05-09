import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const fixDatabase = async () => {
  try {
    console.log('Database Fix Utility');
    console.log('--------------------');
    
    // Extract the connection string
    let mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('Error: MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }
    
    // Parse the URI to extract database name
    const uriParts = mongoURI.split('/');
    let dbName = 'test';
    
    // Check if there's a database name already in the URI
    if (uriParts.length > 3) {
      const lastPart = uriParts[uriParts.length - 1];
      if (lastPart.includes('?')) {
        dbName = lastPart.split('?')[0];
      } else {
        dbName = lastPart;
      }
    }
    
    console.log(`Original Database Name: ${dbName}`);
    
    // Modify URI to use 'test' database
    if (dbName !== 'test') {
      console.log('Updating connection string to use test database...');
      
      // If URI ends with a database name, replace it
      if (uriParts.length > 3) {
        const lastPart = uriParts[uriParts.length - 1];
        if (lastPart.includes('?')) {
          const parts = lastPart.split('?');
          uriParts[uriParts.length - 1] = 'test?' + parts[1];
        } else {
          uriParts[uriParts.length - 1] = 'test';
        }
      } 
      // If URI doesn't have a database name, add it
      else {
        uriParts.push('test');
      }
      
      mongoURI = uriParts.join('/');
      console.log('Updated connection string to use test database');
      
      // Update .env file
      try {
        const envPath = path.resolve(__dirname, '../../.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Replace the MONGODB_URI line
        envContent = envContent.replace(
          /MONGODB_URI=.*/,
          `MONGODB_URI=${mongoURI}`
        );
        
        fs.writeFileSync(envPath, envContent);
        console.log('Updated .env file with new connection string');
      } catch (envError) {
        console.error('Error updating .env file:', envError);
      }
    }
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`Connected to database: ${mongoose.connection.name}`);
    
    // Define schema for collection existence verification
    const schemas = {
      favorites: new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        listingId: { type: mongoose.Schema.Types.ObjectId, required: true },
        createdAt: { type: Date, default: Date.now }
      }),
      
      profiles: new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
        bio: { type: String, default: '' },
        phoneNumber: String,
        profilePicture: String,
        updatedAt: { type: Date, default: Date.now }
      }),
      
      bookings: new mongoose.Schema({
        studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
        listingId: { type: mongoose.Schema.Types.ObjectId, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { 
          type: String, 
          enum: ['pending', 'confirmed', 'cancelled', 'completed'],
          default: 'pending'
        },
        totalPrice: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now }
      })
    };
    
    // Check and create collections if they don't exist
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('Existing collections in test database:', collectionNames);
    
    // Check each required collection
    for (const [name, schema] of Object.entries(schemas)) {
      if (!collectionNames.includes(name)) {
        console.log(`Collection '${name}' does not exist. Creating...`);
        
        // Create model and initialize collection
        const Model = mongoose.model(name, schema);
        await new Model({}).save();
        
        console.log(`Collection '${name}' created successfully in test database.`);
      } else {
        console.log(`Collection '${name}' already exists in test database.`);
      }
    }
    
    // Verify collections again
    const updatedCollections = await db.listCollections().toArray();
    const updatedNames = updatedCollections.map(c => c.name);
    
    console.log('Updated collections list in test database:', updatedNames);
    
    // Success message
    console.log('\nDatabase fix completed successfully!');
    console.log('You can now restart your server for the changes to take effect.');
    
  } catch (error) {
    console.error('Database Fix Error:', error);
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

fixDatabase(); 