import express from 'express';
import mongoose from 'mongoose';
import { Favorite } from '../models/Favorite.mjs';
import { Listing } from '../models/Listing.mjs';
import { authMiddleware } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Get all favorites for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching favorites for user:', userId);
    
    const favorites = await Favorite.find({ userId })
      .populate('listingId')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${favorites.length} favorites`);
    res.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
});

// Add a listing to favorites
router.post('/:listingId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { listingId } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }
    
    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    console.log(`Adding listing ${listingId} to favorites for user ${userId}`);
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ 
      userId: mongoose.Types.ObjectId.isValid(userId) ? userId : null, 
      listingId 
    });
    
    if (existingFavorite) {
      return res.status(400).json({ message: 'Listing already in favorites' });
    }
    
    // Create new favorite
    const favorite = new Favorite({
      userId,
      listingId
    });
    
    await favorite.save();
    console.log('Favorite saved successfully with ID:', favorite._id);
    
    // Fetch the saved favorite to confirm it persisted
    const savedFavorite = await Favorite.findById(favorite._id);
    console.log('Confirmed saved favorite:', savedFavorite);
    
    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Error adding to favorites', error: error.message });
  }
});

// Remove a listing from favorites
router.delete('/:listingId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { listingId } = req.params;
    
    console.log(`Removing listing ${listingId} from favorites for user ${userId}`);
    
    const result = await Favorite.findOneAndDelete({ userId, listingId });
    
    if (!result) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    console.log('Favorite removed successfully');
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Error removing from favorites', error: error.message });
  }
});

// Check if a listing is favorited by the user
router.get('/check/:listingId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { listingId } = req.params;
    
    const favorite = await Favorite.findOne({ userId, listingId });
    
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Error checking favorite status', error: error.message });
  }
});

export default router; 