import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  price: {
    type: Number,
    required: true
  },
  amenities: [String],
  images: [String],
  availableFrom: {
    type: Date,
    required: true
  },
  availableTo: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'unavailable'],
    default: 'available'
  },
  ownerEmail: String,
  ownerPhone: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Listing = mongoose.model('Listing', listingSchema); 