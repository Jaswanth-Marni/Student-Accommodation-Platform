import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema); 