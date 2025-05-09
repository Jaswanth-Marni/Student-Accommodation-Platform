import express from 'express';
import mongoose from 'mongoose';
import { Profile } from '../models/Profile.mjs';
import { User } from '../models/User.mjs';
import { authMiddleware } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Get current user's profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching profile for user:', userId);
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Find or create user profile
    let profile = await Profile.findOne({ userId });
    console.log('Profile lookup result:', profile ? 'Found' : 'Not found');
    
    if (!profile) {
      console.log('Profile not found, creating new profile');
      
      // Get basic info from user model
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Create new profile with basic user info
      profile = new Profile({
        userId,
        phoneNumber: user.phoneNumber || '',
        profilePicture: user.profilePicture || ''
      });
      
      await profile.save();
      console.log('New profile created with ID:', profile._id);
      
      // Verify the profile was saved
      const savedProfile = await Profile.findById(profile._id);
      console.log('Saved profile verification:', savedProfile ? 'Success' : 'Failed');
    }
    
    res.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;
    
    console.log('Updating profile for user from auth middleware:', userId);
    console.log('Received profile data:', profileData);
    
    // Ensure we have a valid userId - either from auth middleware or request body
    let profileUserId = userId;
    
    // If request includes userId, use that (but verify it matches auth user)
    if (profileData.userId) {
      console.log('Request includes userId:', profileData.userId);
      
      // Ensure profile userId matches authenticated user
      if (profileData.userId !== userId && req.user.role !== 'admin') {
        console.error('userId mismatch:', { authUserId: userId, profileUserId: profileData.userId });
        return res.status(403).json({ message: 'Not authorized to update this profile' });
      }
      
      profileUserId = profileData.userId;
    }
    
    console.log('Using userId for profile update:', profileUserId);
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(profileUserId)) {
      console.error('Invalid userId format:', profileUserId);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Find or create profile
    let profile = await Profile.findOne({ userId: profileUserId });
    console.log('Existing profile found:', profile ? 'Yes' : 'No');
    
    if (!profile) {
      console.log('Creating new profile with userId:', profileUserId);
      profile = new Profile({
        userId: profileUserId
      });
    }
    
    // Update profile fields
    if (profileData.phoneNumber !== undefined) profile.phoneNumber = profileData.phoneNumber;
    if (profileData.bio !== undefined) profile.bio = profileData.bio;
    
    // Handle address updates
    if (profileData.address) {
      profile.address = profile.address || {};
      if (profileData.address.street !== undefined) profile.address.street = profileData.address.street;
      if (profileData.address.city !== undefined) profile.address.city = profileData.address.city;
      if (profileData.address.state !== undefined) profile.address.state = profileData.address.state;
      if (profileData.address.zipCode !== undefined) profile.address.zipCode = profileData.address.zipCode;
      if (profileData.address.country !== undefined) profile.address.country = profileData.address.country;
    }
    
    // Handle other fields
    if (profileData.emergencyContact) {
      profile.emergencyContact = profile.emergencyContact || {};
      if (profileData.emergencyContact.name !== undefined) profile.emergencyContact.name = profileData.emergencyContact.name;
      if (profileData.emergencyContact.relationship !== undefined) profile.emergencyContact.relationship = profileData.emergencyContact.relationship;
      if (profileData.emergencyContact.phoneNumber !== undefined) profile.emergencyContact.phoneNumber = profileData.emergencyContact.phoneNumber;
    }
    
    // Always update the timestamp
    profile.updatedAt = Date.now();
    
    await profile.save();
    console.log('Profile saved with ID:', profile._id);
    
    // Verify the profile was saved or updated
    const updatedProfile = await Profile.findById(profile._id);
    console.log('Updated profile verification:', updatedProfile ? 'Success' : 'Failed');
    
    res.json({ message: 'Profile updated', profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Upload profile picture (would need file upload middleware like multer)
router.post('/picture', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { pictureUrl } = req.body;
    
    if (!pictureUrl) {
      return res.status(400).json({ message: 'Picture URL is required' });
    }
    
    // Update profile and user model
    const [profile, user] = await Promise.all([
      Profile.findOneAndUpdate(
        { userId },
        { $set: { profilePicture: pictureUrl, updatedAt: Date.now() } },
        { new: true, upsert: true }
      ),
      User.findByIdAndUpdate(
        userId,
        { $set: { profilePicture: pictureUrl } },
        { new: true }
      )
    ]);
    
    res.json({ message: 'Profile picture updated', profile });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Error updating profile picture', error: error.message });
  }
});

export default router; 