import mongoose from 'mongoose';

const listingSchemaOld = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  facilities: [{
    type: String,
  }],
  nearby: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
  },
  address: String,
  ownerPhone: String,
  ownerEmail: String,
}, {
  timestamps: true,
});

// Using a different model name to avoid conflicts
const OldListing = mongoose.model('OldListing', listingSchemaOld);

export default OldListing; 