import express from 'express';
import { Listing } from '../models/Listing.mjs';
import { authMiddleware, ownerMiddleware } from '../middleware/auth.middleware.mjs';

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
    console.log('Creating new listing with data:', req.body);
    
    // Extract required fields or provide defaults to match schema requirements
    const listingData = {
      // Use the authenticated user's ID from the request
      landlordId: req.user._id,
      title: req.body.title || req.body.name || 'Untitled Property',
      description: req.body.description || '',
      address: req.body.address || {
        street: req.body.address || '',
        city: req.body.location || '',
        state: '',
        zipCode: '',
        country: ''
      },
      price: req.body.price || 0,
      amenities: req.body.amenities || req.body.facilities || [],
      images: req.body.images || (req.body.image ? [req.body.image] : []),
      availableFrom: req.body.availableFrom || new Date(),
      availableTo: req.body.availableTo || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      status: req.body.status || 'available'
    };
    
    // Add ownerEmail as a custom property if needed for the frontend
    if (req.body.ownerEmail) {
      listingData.ownerEmail = req.body.ownerEmail;
    }
    
    if (req.body.ownerPhone) {
      listingData.ownerPhone = req.body.ownerPhone;
    }
    
    console.log('Processed listing data:', listingData);
    
    const listing = new Listing(listingData);
    await listing.save();
    
    console.log('Listing created successfully:', listing);
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
});

// Update listing (owner only)
router.put('/:id', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    console.log('Updating listing:', req.params.id);
    console.log('Update data:', req.body);
    console.log('User:', req.user._id);
    
    // First find the listing to check ownership
    const existingListing = await Listing.findById(req.params.id);
    
    if (!existingListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if user is the owner of this listing
    if (existingListing.landlordId.toString() !== req.user._id.toString() &&
        existingListing.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: 'You are not authorized to update this listing' });
    }
    
    // Now update the listing
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    console.log('Listing updated successfully:', listing);
    res.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Error updating listing', error: error.message });
  }
});

// Delete listing (owner only)
router.delete('/:id', authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    console.log('Deleting listing:', req.params.id);
    console.log('User:', req.user._id);
    
    // First find the listing to check ownership
    const existingListing = await Listing.findById(req.params.id);
    
    if (!existingListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if user is the owner of this listing
    if (existingListing.landlordId.toString() !== req.user._id.toString() &&
        existingListing.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: 'You are not authorized to delete this listing' });
    }
    
    // Now delete the listing
    const listing = await Listing.findByIdAndDelete(req.params.id);
    
    console.log('Listing deleted successfully');
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Error deleting listing', error: error.message });
  }
});

export default router; 