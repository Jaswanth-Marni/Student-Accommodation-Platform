import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phoneNumber: {
    type: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  preferences: {
    roomType: {
      type: String,
      enum: ['single', 'double', 'shared', 'any'],
      default: 'any'
    },
    priceRange: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100000
      }
    },
    amenities: [String],
    location: [String]
  },
  profilePicture: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Use the 'profiles' collection in the test database
export const Profile = mongoose.model('Profile', profileSchema, 'profiles'); 