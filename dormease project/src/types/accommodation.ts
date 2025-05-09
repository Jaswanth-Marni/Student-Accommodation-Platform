export interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob?: string;
  userType: 'student' | 'owner';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Listing {
  id: string;
  landlordId: string;
  title: string;
  description: string;
  address: Address;
  price: number;
  amenities: string[];
  images: string[];
  availableFrom: Date;
  availableTo: Date;
  status: 'available' | 'booked' | 'unavailable';
  createdAt: Date;
}

export interface Booking {
  id: string;
  listingId: string;
  studentId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'student' | 'landlord' | 'admin';
  profilePicture?: string;
  createdAt: Date;
}

export interface AccommodationCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  address: string;
  image: string;
  facilities: string[];
  nearby: string[];
  owner: string;
  ownerEmail: string;
  ownerPhone: string;
  status: 'active' | 'pending' | 'inactive';
}
