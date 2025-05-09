// API client for backend data management
// All data is stored in MongoDB via the backend API

import { Listing } from '../types/accommodation';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to extract userId from JWT token
export const getUserId = (): string => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found in localStorage');
      return '';
    }
    
    // JWT tokens are in format: header.payload.signature
    // We need the payload part which is the second segment
    const tokenParts = token.split('.');
    if (tokenParts.length < 2) {
      console.warn('Invalid token format');
      return '';
    }
    
    // Decode JWT payload
    const base64Payload = tokenParts[1];
    const payload = JSON.parse(atob(base64Payload));
    
    // The userId might be stored in different fields depending on the JWT implementation
    const userId = payload.userId || payload.id || payload.sub || '';
    
    if (!userId) {
      console.warn('No userId found in token payload');
    } else {
      console.log('Successfully extracted userId from token:', userId);
    }
    
    return userId;
  } catch (error) {
    console.error('Error extracting userId from token:', error);
    return '';
  }
};

export interface Booking {
  id: string;
  propertyId: string;
  studentName: string;
  studentEmail: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

// Listings management
export const saveListings = async (newListings: any[]) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/listings/bulk`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newListings)
    });
    if (!response.ok) throw new Error('Failed to save listings');
  } catch (error) {
    console.error('Error saving listings:', error);
    throw error;
  }
};

export const getListings = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Fetching listings with token:', token ? 'Present' : 'Missing');
    
    const response = await fetch(`${API_BASE_URL}/listings`, {
      mode: 'cors',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Server endpoint not found. Please ensure the server is running.');
        return [];
      }
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Listings response data:', data);
    
    // The API can return either an array directly or an object with a listings property
    // Handle both formats
    const listings = Array.isArray(data) ? data : data.listings || [];
    console.log('Processed listings:', listings);
    
    // Check for any missing properties in the backend response
    const userEmail = JSON.parse(localStorage.getItem('user') || '{}').email;
    
    // Convert backend model to frontend format if needed
    const formattedListings = listings.map(listing => {
      const id = listing._id || listing.id;
      
      return {
        id: id,
        name: listing.title || listing.name,
        location: listing.address?.city || listing.location || '',
        price: listing.price || 0,
        image: Array.isArray(listing.images) && listing.images.length > 0 
          ? listing.images[0] 
          : listing.image || '',
        description: listing.description || '',
        facilities: listing.amenities || listing.facilities || [],
        nearby: listing.nearby || [],
        status: listing.status === 'available' ? 'active' : 
                listing.status === 'unavailable' ? 'inactive' : 
                'pending',
        address: listing.address?.street || listing.address || '',
        ownerPhone: listing.ownerPhone || '',
        ownerEmail: listing.ownerEmail || userEmail // Ensure ownerEmail is preserved
      };
    });
    
    console.log('Formatted listings for UI:', formattedListings);
    return formattedListings;
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};

export const addListing = async (listing: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    console.log('Calling API to add listing:', listing);
    console.log('Using token:', token.substring(0, 15) + '...');
    
    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listing)
    });
    
    // Handle non-ok response
    if (!response.ok) {
      // Try to get error details from response
      let errorMsg = 'Failed to add listing';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (e) {
        // If can't parse JSON, use status text
        errorMsg = `${errorMsg}: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMsg);
    }
    
    const data = await response.json();
    console.log('API response for add listing:', data);
    return data;
  } catch (error) {
    console.error('Error adding listing:', error);
    throw error;
  }
};

export const updateListing = async (updatedListing: Listing) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/listings/${updatedListing.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedListing)
    });
    if (!response.ok) throw new Error('Failed to update listing');
    return await response.json();
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const deleteListing = async (listingId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete listing');
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

// Selected listing management
let selectedListing: Listing | null = null;

export const setSelectedListing = (listing: Listing | null) => {
  selectedListing = listing;
};

export const getSelectedListing = () => {
  return selectedListing;
};

// Search and filter
export const searchListings = async (query: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search listings');
    const data = await response.json();
    return data.listings;
  } catch (error) {
    console.error('Error searching listings:', error);
    return [];
  }
};

export const filterListings = async (filters: {
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  amenities?: string[];
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.amenities?.length) queryParams.append('amenities', filters.amenities.join(','));

    const response = await fetch(`${API_BASE_URL}/listings/filter?${queryParams}`);
    if (!response.ok) throw new Error('Failed to filter listings');
    const data = await response.json();
    return data.listings;
  } catch (error) {
    console.error('Error filtering listings:', error);
    return [];
  }
};

export const getBookings = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const data = await response.json();
    return data.bookings || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const addBooking = async (booking: {
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found for addBooking');
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    // Get user data from localStorage to add student information
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData || !userData.email) {
      console.error('No user data found for booking');
      throw new Error('User data not found. Please log in again.');
    }
    
    // Create a complete booking object that includes student information
    const completeBooking = {
      ...booking,
      // Add student information
      studentName: userData.name || '',
      studentEmail: userData.email,
      // Map the dates to checkIn/checkOut for compatibility with backend model
      checkIn: booking.startDate,
      checkOut: booking.endDate
    };
    
    console.log('Adding booking with data:', completeBooking);
    
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(completeBooking)
    });
    
    console.log('Booking response status:', response.status);
    
    if (!response.ok) {
      let errorMsg = 'Failed to add booking';
      try {
        const errorData = await response.json();
        console.error('Add booking error details:', errorData);
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (e) {
        errorMsg = `${errorMsg}: ${response.status} ${response.statusText}`;
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMsg);
    }
    
    try {
      const result = await response.json();
      console.log('Add booking successful:', result);
      return result;
    } catch (jsonError) {
      // Some endpoints might return empty body on success
      console.log('No JSON response returned, but booking operation was successful');
      return { success: true };
    }
  } catch (error) {
    console.error('Error adding booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update booking status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const getBookingDetails = async (bookingId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch booking details');
    const data = await response.json();
    return data.booking;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

// Favorites management
export const getFavorites = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Getting favorites with token:', token ? 'Present' : 'Missing');
    
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch favorites: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Favorites data received:', data);
    return data.favorites || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export const addToFavorites = async (listingId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found for addToFavorites');
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    console.log(`Adding listing ${listingId} to favorites with token`);
    
    const response = await fetch(`${API_BASE_URL}/favorites/${listingId}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Add favorite response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMsg = 'Failed to add to favorites';
      try {
        const errorData = await response.json();
        console.error('Add favorite error details:', errorData);
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (e) {
        errorMsg = `${errorMsg}: ${response.status} ${response.statusText}`;
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMsg);
    }
    
    try {
      const result = await response.json();
      console.log('Add to favorites successful:', result);
      return result;
    } catch (jsonError) {
      // Some endpoints might return empty body on success
      console.log('No JSON response returned, but operation was successful');
      return { success: true };
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (listingId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found for removeFromFavorites');
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    console.log(`Removing listing ${listingId} from favorites with token`);
    
    const response = await fetch(`${API_BASE_URL}/favorites/${listingId}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`Remove favorite response status: ${response.status}`);
    
    if (!response.ok) {
      let errorMsg = 'Failed to remove from favorites';
      try {
        const errorData = await response.json();
        console.error('Remove favorite error details:', errorData);
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (e) {
        errorMsg = `${errorMsg}: ${response.status} ${response.statusText}`;
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMsg);
    }
    
    try {
      const result = await response.json();
      console.log('Remove from favorites successful:', result);
      return result;
    } catch (jsonError) {
      // Some endpoints might return empty body on success
      console.log('No JSON response returned, but operation was successful');
      return { success: true };
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const checkIsFavorite = async (listingId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/favorites/check/${listingId}`, {
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to check favorite status');
    }
    
    const data = await response.json();
    return data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// Profile management
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/profile`, {
      mode: 'cors',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    // Ensure we have a valid userId
    if (!profileData.userId) {
      throw new Error('User ID is required');
    }
    
    // MongoDB ObjectId format validation (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(profileData.userId);
    if (!isValidObjectId) {
      console.error('Invalid ObjectId format:', profileData.userId);
      throw new Error('User ID must be a valid MongoDB ObjectId');
    }
    
    console.log('Sending profile update with valid ObjectId:', profileData.userId);
    
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    console.log('Profile update response status:', response.status);
    
    if (!response.ok) {
      // Get more details from the error response
      let errorMsg = 'Failed to update profile';
      try {
        const errorData = await response.json();
        console.error('Profile update error details:', errorData);
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (e) {
        // If can't parse JSON, use status text
        errorMsg = `${errorMsg}: ${response.status} ${response.statusText}`;
        console.error('Error parsing error response:', e);
      }
      throw new Error(errorMsg);
    }
    
    const data = await response.json();
    console.log('Profile update successful:', data);
    return data.profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const updateProfilePicture = async (pictureUrl: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/profile/picture`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ pictureUrl })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile picture');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};