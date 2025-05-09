import express from 'express';
import { Booking } from '../models/Booking.mjs';
import { Listing } from '../models/Listing.mjs';
import { authMiddleware } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Get all bookings for the current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    console.log(`Fetching bookings for user: ${userId}, role: ${userRole}`);
    
    let bookings;
    
    // If landlord, get bookings for their listings
    if (userRole === 'landlord') {
      // First get all listings owned by this landlord
      const listings = await Listing.find({ landlordId: userId });
      const listingIds = listings.map(listing => listing._id);
      
      // Then get all bookings for these listings
      bookings = await Booking.find({ listingId: { $in: listingIds } })
        .populate('listingId')
        .populate('studentId', 'firstName lastName email')
        .sort({ createdAt: -1 });
      
      console.log(`Found ${bookings.length} bookings for landlord's listings`);
    } 
    // If student, get their bookings
    else {
      bookings = await Booking.find({ studentId: userId })
        .populate('listingId')
        .sort({ createdAt: -1 });
      
      console.log(`Found ${bookings.length} bookings for student`);
    }
    
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Create a new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { listingId, startDate, endDate, totalPrice } = req.body;
    
    console.log(`Creating booking for listing ${listingId} by user ${userId}`);
    
    if (!listingId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: { listingId, startDate, endDate, totalPrice }
      });
    }
    
    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if the listing is available for the requested dates
    const conflictingBookings = await Booking.find({
      listingId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        // New booking starts during an existing booking
        { 
          startDate: { $lte: new Date(startDate) }, 
          endDate: { $gte: new Date(startDate) } 
        },
        // New booking ends during an existing booking
        { 
          startDate: { $lte: new Date(endDate) }, 
          endDate: { $gte: new Date(endDate) } 
        },
        // New booking encompasses an existing booking
        { 
          startDate: { $gte: new Date(startDate) }, 
          endDate: { $lte: new Date(endDate) } 
        }
      ]
    });
    
    if (conflictingBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Listing is not available for the selected dates',
        conflictingBookings
      });
    }
    
    // Create booking
    const booking = new Booking({
      studentId: userId,
      listingId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    await booking.save();
    console.log('Booking created successfully:', booking._id);
    
    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking: await Booking.findById(booking._id)
        .populate('listingId')
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Update booking status (landlord only)
router.put('/:bookingId/status', authMiddleware, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    console.log(`Updating booking ${bookingId} status to ${status}`);
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only landlord can confirm/cancel/complete bookings
    // Student can only cancel their own bookings
    if (userRole === 'landlord') {
      // Verify the landlord owns the listing
      const listing = await Listing.findById(booking.listingId);
      if (!listing || listing.landlordId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }
    } else if (userRole === 'student') {
      // Students can only cancel their own bookings
      if (booking.studentId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }
      
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Students can only cancel bookings' });
      }
    }
    
    // Update booking status
    booking.status = status;
    
    // If cancelled and was previously confirmed, set payment status to refunded
    if (status === 'cancelled' && booking.status === 'confirmed' && booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }
    
    await booking.save();
    console.log('Booking status updated successfully');
    
    res.json({ 
      message: 'Booking status updated', 
      booking: await Booking.findById(bookingId)
        .populate('listingId')
        .populate('studentId', 'firstName lastName email')
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
});

// Get a specific booking
router.get('/:bookingId', authMiddleware, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    const booking = await Booking.findById(bookingId)
      .populate('listingId')
      .populate('studentId', 'firstName lastName email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Verify user has permission to view this booking
    if (userRole === 'student' && booking.studentId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    } else if (userRole === 'landlord') {
      const listing = await Listing.findById(booking.listingId);
      if (!listing || listing.landlordId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to view this booking' });
      }
    }
    
    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
});

export default router; 