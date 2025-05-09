import express from 'express';
import { Listing } from '../models/Listing';
import { authMiddleware, ownerMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Get all listings (public)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Error fetching listings' });
  }
});

// Get single listing (public)
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ message: 'Error fetching listing' });
  }
});

// Create listing (owner only)
router.post('/', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const listing = new Listing({
      ...req.body,
      ownerEmail: req.user?.userId
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Error creating listing' });
  }
});

// Update listing (owner only)
router.put('/:id', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, ownerEmail: req.user?.userId },
      req.body,
      { new: true }
    );
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found or unauthorized' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Error updating listing' });
  }
});

// Delete listing (owner only)
router.delete('/:id', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({
      _id: req.params.id,
      ownerEmail: req.user?.userId
    });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found or unauthorized' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Error deleting listing' });
  }
});

export default router; 