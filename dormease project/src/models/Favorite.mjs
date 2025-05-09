import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't favorite the same listing twice
favoriteSchema.index({ userId: 1, listingId: 1 }, { unique: true });

// Use the 'favorites' collection in the test database
export const Favorite = mongoose.model('Favorite', favoriteSchema, 'favorites'); 