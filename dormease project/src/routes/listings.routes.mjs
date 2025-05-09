import express from 'express';
import { Listing } from '../models/Listing.mjs';
import { authMiddleware } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json({ listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Error fetching listings' });
  }
});

// Create a new listing
router.post('/', authMiddleware, async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Error creating listing' });
  }
});

// Update a listing
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Error updating listing' });
  }
});

// Delete a listing
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Error deleting listing' });
  }
});

// Bulk update listings
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const listings = req.body;
    await Listing.deleteMany({});
    await Listing.insertMany(listings);
    res.json({ message: 'Listings updated successfully' });
  } catch (error) {
    console.error('Error updating listings:', error);
    res.status(500).json({ message: 'Error updating listings' });
  }
});

export default router; 