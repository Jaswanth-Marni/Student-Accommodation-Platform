import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { getListings, addListing, getBookings, updateBookingStatus as sharedUpdateBookingStatus, saveListings } from '@/lib/sharedDataStore';
import { Listing } from '@/types/accommodation';

export type OwnerProperty = {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  description: string;
  facilities: string[];
  nearby: string[];
  status: 'active' | 'inactive' | 'pending';
  address?: string;
  ownerPhone?: string;
  ownerEmail?: string;
};

export type OwnerBooking = {
  id: string;
  propertyId: string;
  studentName: string;
  studentEmail: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};

export type UserData = {
  email: string;
  userType: string;
  name: string;
  phone: string;
  address: string;
  dob: string;
  token: string;
};

export function useOwnerDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is logged in and is an owner
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/auth?type=owner');
      return;
    }
    const parsedUser = JSON.parse(user) as UserData;
    if (parsedUser.userType !== 'owner') {
      navigate('/auth?type=owner');
      return;
    }
    setUserData(parsedUser);
    
    // Load data asynchronously
    const loadData = async () => {
      try {
        console.log('Loading owner dashboard data...');
        setIsLoading(true);
        
        const listings = await getListings();
        console.log('Loaded listings:', listings);
        
        const bookings = await getBookings();
        console.log('Loaded bookings:', bookings);
        
        // Ensure listings and bookings are arrays before filtering
        const safeListings = Array.isArray(listings) ? listings : [];
        const safeBookings = Array.isArray(bookings) ? bookings : [];
        
        // Try to get cached properties from localStorage
        let cachedProperties = [];
        try {
          const cachedPropertiesJson = localStorage.getItem(`${parsedUser.email}-properties`);
          if (cachedPropertiesJson) {
            cachedProperties = JSON.parse(cachedPropertiesJson);
            console.log('Loaded cached properties:', cachedProperties);
          }
        } catch (err) {
          console.warn('Error loading cached properties:', err);
        }
        
        // Merge server properties and cached properties using ids
        const serverPropertyIds = new Set(safeListings.map(l => l.id || l._id));
        const mergedProperties = [
          ...safeListings,
          ...cachedProperties.filter(p => !serverPropertyIds.has(p.id))
        ];
        
        // Filter properties for this owner
        const ownerProperties = mergedProperties.filter(l => l.ownerEmail === parsedUser.email);
        console.log('Owner properties:', ownerProperties);
        setProperties(ownerProperties);
        
        // Filter bookings for this owner's properties
        const ownerBookings = safeBookings.filter(b => {
          const prop = mergedProperties.find(l => l.id === b.propertyId);
          return prop && prop.ownerEmail === parsedUser.email;
        });
        console.log('Owner bookings:', ownerBookings);
        setBookings(ownerBookings);
      } catch (error) {
        console.error('Error loading data:', error);
        
        // Try to load from cache if server fetch fails
        try {
          const cachedPropertiesJson = localStorage.getItem(`${parsedUser.email}-properties`);
          if (cachedPropertiesJson) {
            const cachedProperties = JSON.parse(cachedPropertiesJson);
            setProperties(cachedProperties);
            console.log('Loaded properties from cache after server error');
          } else {
            setProperties([]);
          }
        } catch (err) {
          console.error('Error loading from cache:', err);
          setProperties([]);
        }
        
        setBookings([]);
        toast({
          title: "Error loading data",
          description: "Failed to load your properties and bookings. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/'); // Changed to navigate to landing page
  };

  const handleDeleteAccount = () => {
    // In a real application, this would call an API to delete the account
    localStorage.removeItem('user');
    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
      variant: "destructive",
    });
    navigate('/'); // Changed to navigate to landing page
  };

  const addProperty = async (property: Omit<OwnerProperty, 'id' | 'status'>) => {
    try {
      if (property.price > 15000) {
        toast({
          title: "Price limit exceeded",
          description: "Property price cannot exceed ₹15,000 per month.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Adding property with data:", property);
      
      // Transform the property data to match the backend model
      const newProperty = {
        title: property.name,
        description: property.description || "",
        address: {
          street: property.address || '',
          city: property.location || '',
          state: '',
          zipCode: '',
          country: ''
        },
        price: property.price,
        amenities: property.facilities || [],
        images: [property.image],
        availableFrom: new Date(),
        availableTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'available',
        ownerEmail: userData?.email,
        ownerPhone: userData?.phone
      };
      
      console.log("Sending to API:", newProperty);
      
      const createdListing = await addListing(newProperty as any);
      console.log("Created listing:", createdListing);
      
      // Format the created listing for the frontend and add it to the properties state
      const newUiProperty: OwnerProperty = {
        id: createdListing._id || createdListing.id || Math.random().toString(36).substring(2, 11),
        name: property.name,
        location: property.location,
        price: property.price,
        image: property.image,
        description: property.description || "",
        facilities: property.facilities || [],
        nearby: property.nearby || [],
        status: 'active',
        address: property.address,
        ownerPhone: property.ownerPhone || userData?.phone || "",
        ownerEmail: property.ownerEmail || userData?.email || ""
      };
      
      // Add the new property to the existing properties (immutable update)
      setProperties(prevProperties => {
        const updatedProperties = [...prevProperties, newUiProperty];
        
        // Save to localStorage for persistence
        try {
          if (userData?.email) {
            localStorage.setItem(`${userData.email}-properties`, JSON.stringify(updatedProperties));
            console.log('Saved properties to localStorage');
          }
        } catch (err) {
          console.warn('Failed to save properties to localStorage:', err);
        }
        
        return updatedProperties;
      });
      
      // Do NOT refresh from the server as it may not have the correct mapping yet
      // and could cause the newly added property to disappear
      
      toast({
        title: "Property added",
        description: "Your property has been successfully added.",
      });
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Error adding property",
        description: `Failed to add the property: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const updateProperty = (id: string, updates: Partial<OwnerProperty>) => {
    if (updates.price && updates.price > 15000) {
      toast({
        title: "Price limit exceeded",
        description: "Property price cannot exceed ₹15,000 per month.",
        variant: "destructive",
      });
      return;
    }
    
    // We can't use getListings().findIndex because getListings returns a Promise
    const updatePropertyAsync = async () => {
      try {
        // Update in memory first
        setProperties(prevProperties => {
          const updatedProperties = prevProperties.map(property => 
            property.id === id ? { ...property, ...updates } : property
          );
          
          // Save to localStorage for persistence
          try {
            if (userData?.email) {
              localStorage.setItem(`${userData.email}-properties`, JSON.stringify(updatedProperties));
              console.log('Saved updated properties to localStorage');
            }
          } catch (err) {
            console.warn('Failed to save updated properties to localStorage:', err);
          }
          
          return updatedProperties;
        });
        
        // Then update on server
        const listings = await getListings();
        const updatedListings = listings.map(listing => 
          listing.id === id ? { ...listing, ...updates } : listing
        );
        await saveListings(updatedListings);
        
        toast({
          title: "Property updated",
          description: "Your property has been successfully updated.",
        });
      } catch (error) {
        console.error('Error updating property:', error);
        toast({
          title: "Error updating property",
          description: "Failed to update the property. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    updatePropertyAsync();
  };

  const deleteProperty = (id: string) => {
    const deletePropertyAsync = async () => {
      try {
        // Delete from UI first
        setProperties(prevProperties => {
          const filteredProperties = prevProperties.filter(p => p.id !== id);
          
          // Save to localStorage for persistence
          try {
            if (userData?.email) {
              localStorage.setItem(`${userData.email}-properties`, JSON.stringify(filteredProperties));
              console.log('Saved filtered properties to localStorage after delete');
            }
          } catch (err) {
            console.warn('Failed to save filtered properties to localStorage:', err);
          }
          
          return filteredProperties;
        });
        
        // Then delete from server
        const listings = await getListings();
        const filteredListings = listings.filter(p => p.id !== id);
        await saveListings(filteredListings);
        
        toast({
          title: "Property deleted",
          description: "Your property has been successfully deleted.",
          variant: "destructive",
        });
      } catch (error) {
        console.error('Error deleting property:', error);
        toast({
          title: "Error deleting property",
          description: "Failed to delete the property. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    deletePropertyAsync();
  };

  const updateBookingStatus = (id: string, status: OwnerBooking['status']) => {
    const updateAsync = async () => {
      try {
        await sharedUpdateBookingStatus(id, status);
        
        // Refresh the bookings data
        const updatedBookings = await getBookings();
        const updatedListings = await getListings();
        
        // Filter bookings for this owner's properties 
        const ownerBookings = updatedBookings.filter(b => {
          const prop = updatedListings.find(l => l.id === b.propertyId);
          return prop && prop.ownerEmail === userData?.email;
        });
        
        setBookings(ownerBookings);
        
        toast({
          title: "Booking status updated",
          description: `Booking has been ${status}.`,
        });
      } catch (error) {
        console.error('Error updating booking status:', error);
        toast({
          title: "Error updating booking",
          description: "Failed to update booking status. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    updateAsync();
  };

  return {
    userData,
    setUserData,
    activeTab,
    setActiveTab,
    properties,
    bookings,
    isLoading,
    handleLogout,
    handleDeleteAccount,
    addProperty,
    updateProperty,
    deleteProperty,
    updateBookingStatus
  };
}
