import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  facilities: [{ type: String }],
  nearby: [{ type: String }],
  ownerEmail: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  address: { type: String, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema); 