import { connectDB } from './lib/mongodb.mjs';
import { User } from './models/User.mjs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('Successfully connected to MongoDB!');

    // Test user creation
    const testUser = new User({
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Test',
      lastName: 'User',
      role: 'student'
    });

    await testUser.save();
    console.log('Test user created successfully:', testUser);

    // Fetch all users
    const users = await User.find();
    console.log('All users in database:', users);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

testConnection(); 