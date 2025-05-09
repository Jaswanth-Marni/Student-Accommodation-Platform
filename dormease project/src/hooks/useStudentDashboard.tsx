import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/accommodation';
import { getListings, addBooking, getBookings, updateBookingStatus, Booking, addToFavorites, removeFromFavorites, getFavorites } from '@/lib/sharedDataStore';
import { AccommodationCardProps } from '@/types/accommodation';

export const useStudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [filteredListings, setFilteredListings] = useState<AccommodationCardProps[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookings, setBookings] = useState<string[]>([]);
  const [bookingStatuses, setBookingStatuses] = useState<Record<string, 'pending' | 'confirmed' | 'cancelled'>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user and initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          navigate('/auth?type=student');
          return;
        }
        const parsedUser = JSON.parse(user) as UserData;
        if (parsedUser.userType !== 'student') {
          navigate('/auth?type=student');
          return;
        }
        setUserData(parsedUser);
        setIsProfileComplete(Boolean(parsedUser.name && parsedUser.phone && parsedUser.address));

        // Try to load favorites from database first
        try {
          console.log('Fetching favorites from database...');
          const dbFavorites = await getFavorites();
          
          if (dbFavorites && dbFavorites.length > 0) {
            console.log('Loaded favorites from database:', dbFavorites);
            
            // Extract listing IDs from the favorites data
            // Handle different possible formats of the listing ID in the response
            const favoriteIds = dbFavorites.map((fav: any) => {
              let listingId = '';
              
              // If listingId is a string, use it directly
              if (typeof fav.listingId === 'string') {
                listingId = fav.listingId;
              }
              // If listingId is an object with _id property
              else if (fav.listingId && fav.listingId._id) {
                listingId = fav.listingId._id;
              }
              // Check if the fav item itself has an id property
              else if (fav.id) {
                listingId = fav.id;
              }
              
              console.log(`Extracted listingId ${listingId} from favorite:`, fav);
              return listingId;
            }).filter(id => id); // Filter out any empty strings
            
            console.log('Parsed favorite IDs:', favoriteIds);
            
            if (favoriteIds.length > 0) {
              setFavorites(favoriteIds);
              // Update localStorage as a backup
              localStorage.setItem(`favorites_${parsedUser.email}`, JSON.stringify(favoriteIds));
            }
          } else {
            // Fall back to localStorage if no favorites in database
            console.log('No favorites found in database, checking localStorage...');
            const savedFavorites = localStorage.getItem(`favorites_${parsedUser.email}`);
            if (savedFavorites) {
              const parsedFavorites = JSON.parse(savedFavorites);
              setFavorites(parsedFavorites);
              console.log('Loaded favorites from localStorage:', parsedFavorites);
              
              // Sync localStorage favorites to database if they exist
              if (parsedFavorites.length > 0) {
                console.log('Syncing localStorage favorites to database...');
                // We'll sync these to the database one by one
                for (const favId of parsedFavorites) {
                  try {
                    console.log(`Syncing favorite ${favId} to database`);
                    await addToFavorites(favId);
                  } catch (e) {
                    console.error('Error syncing favorite to database:', favId, e);
                  }
                }
              }
            }
          }
        } catch (favError) {
          console.error('Error loading favorites from database:', favError);
          // Fall back to localStorage
          const savedFavorites = localStorage.getItem(`favorites_${parsedUser.email}`);
          if (savedFavorites) {
            const parsedFavorites = JSON.parse(savedFavorites);
            setFavorites(parsedFavorites);
            console.log('Loaded favorites from localStorage (after database error):', parsedFavorites);
          }
        }

        // Load listings and bookings
        const [listingsData, bookingsData] = await Promise.all([
          getListings(),
          getBookings()
        ]);

        if (listingsData) {
          const mappedListings = listingsData.map((listing: any) => ({
            ...listing,
            owner: listing.ownerEmail || '',
            ownerPhone: listing.ownerPhone || '',
            ownerEmail: listing.ownerEmail || '',
            address: listing.address || '',
          }));
          setFilteredListings(mappedListings);
        }

        if (bookingsData) {
          const userBookings = bookingsData.filter((b: Booking) => b.studentEmail === parsedUser.email);
          setBookings(userBookings.map((b: Booking) => b.propertyId));
          
          const statusMap: Record<string, 'pending' | 'confirmed' | 'cancelled'> = {};
          userBookings.forEach((b: Booking) => { statusMap[b.propertyId] = b.status; });
          setBookingStatuses(statusMap);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load data. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [navigate]);

  // Listen for changes to booking statuses
  useEffect(() => {
    const handleStorageChange = async () => {
      if (!userData?.email) return;
      try {
        const bookingsData = await getBookings();
        if (bookingsData) {
          const userBookings = bookingsData.filter((b: Booking) => b.studentEmail === userData.email);
          setBookings(userBookings.map((b: Booking) => b.propertyId));
          
          const statusMap: Record<string, 'pending' | 'confirmed' | 'cancelled'> = {};
          userBookings.forEach((b: Booking) => { statusMap[b.propertyId] = b.status; });
          setBookingStatuses(statusMap);
        }
      } catch (error) {
        console.error('Error updating bookings:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userData]);

  // Search filter
  useEffect(() => {
    const filterListings = async () => {
      try {
        const listingsData = await getListings();
        if (!listingsData) return;

        if (!searchQuery.trim()) {
          const mappedListings = listingsData.map((listing: any) => ({
            ...listing,
            owner: listing.ownerEmail || '',
            ownerPhone: listing.ownerPhone || '',
            ownerEmail: listing.ownerEmail || '',
            address: listing.address || '',
          }));
          setFilteredListings(mappedListings);
          return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = listingsData
          .filter((item: any) =>
            item.name.toLowerCase().includes(query) ||
            (item.ownerEmail && item.ownerEmail.toLowerCase().includes(query)) ||
            item.location.toLowerCase().includes(query) ||
            (item.address && item.address.toLowerCase().includes(query)) ||
            item.facilities.some((facility: string) => facility.toLowerCase().includes(query)) ||
            item.nearby.some((nearby: string) => nearby.toLowerCase().includes(query))
          )
          .map((listing: any) => ({
            ...listing,
            owner: listing.ownerEmail || '',
            ownerPhone: listing.ownerPhone || '',
            ownerEmail: listing.ownerEmail || '',
            address: listing.address || '',
          }));
        setFilteredListings(filtered);
      } catch (error) {
        console.error('Error filtering listings:', error);
        toast({
          title: "Error",
          description: "Failed to filter listings. Please try again.",
          variant: "destructive",
        });
      }
    };

    filterListings();
  }, [searchQuery]);

  const accommodationListings = filteredListings;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  const handleDeleteAccount = () => {
    const email = userData?.email;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (email) {
      localStorage.removeItem(`favorites_${email}`);
    }
    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
      variant: "destructive",
    });
    navigate('/');
  };

  const toggleFavorite = async (id: string) => {
    if (!userData?.email) return;
    
    try {
      const isFavorited = favorites.includes(id);
      console.log(`Toggling favorite for listing ${id}, current status: ${isFavorited ? 'favorited' : 'not favorited'}`);
      
      // Update state immediately for better user experience
      const newFavorites = isFavorited
        ? favorites.filter(itemId => itemId !== id)
        : [...favorites, id];
        
      // Set the favorites state first for immediate UI feedback
      setFavorites(newFavorites);
      
      // Then update localStorage
      localStorage.setItem(`favorites_${userData.email}`, JSON.stringify(newFavorites));
      
      // Then update the database (this might take longer)
      if (isFavorited) {
        // Remove from favorites in database
        console.log(`Removing listing ${id} from favorites in database`);
        await removeFromFavorites(id);
        console.log(`Successfully removed listing ${id} from favorites in database`);
      } else {
        // Add to favorites in database
        console.log(`Adding listing ${id} to favorites in database`);
        await addToFavorites(id);
        console.log(`Successfully added listing ${id} to favorites in database`);
      }
      
      // Show toast notification after database operation is complete
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited
          ? "The accommodation has been removed from your favorites."
          : "The accommodation has been added to your favorites.",
      });
        
    } catch (error) {
      console.error('Error updating favorites in database:', error);
      
      // Revert the UI change if database update fails
      console.log('Reverting UI state due to database update failure');
      const revertedFavorites = !favorites.includes(id)
        ? [...favorites, id]
        : favorites.filter(itemId => itemId !== id);
      
      setFavorites(revertedFavorites);
      localStorage.setItem(`favorites_${userData.email}`, JSON.stringify(revertedFavorites));
      
      toast({
        title: "Favorites update failed",
        description: "There was an error updating your favorites in the database.",
        variant: "destructive",
      });
    }
  };

  const toggleBooking = async (id: string) => {
    if (!userData) {
      console.error('No user data found for booking');
      toast({
        title: "Authentication Error",
        description: "Please log in again to book accommodations.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(`Toggling booking for listing ${id}`);
      
      // Get current bookings
      const bookingsData = await getBookings();
      console.log('Current bookings:', bookingsData);
        
      // Check if this listing is already booked by this user
      const userBooking = bookingsData ? 
        bookingsData.find((b: Booking) => b.studentEmail === userData.email && b.propertyId === id) : 
        undefined;
      
      console.log('Current booking status for this listing:', userBooking || 'Not booked');
      
      if (userBooking) {
        // Cancel booking
        console.log(`Cancelling booking ${userBooking.id} for listing ${id}`);
        await updateBookingStatus(userBooking.id, 'cancelled');
        
        // Update UI state
        setBookings(prev => prev.filter(bid => bid !== id));
        setBookingStatuses(prev => { 
          const copy = {...prev}; 
          delete copy[id]; 
          return copy; 
        });
        
        toast({
          title: "Booking cancelled",
          description: "Your booking has been cancelled successfully.",
        });
      } else {
        // Add new booking
        console.log(`Creating new booking for listing ${id}`);
        
        // Calculate dates for a 30-day booking period
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30); // 30 day booking by default
        
        // Get listing details
        const listing = filteredListings.find(l => l.id === id);
        
        if (!listing) {
          console.error(`Listing ${id} not found in filtered listings`);
          toast({
            title: "Booking Error",
            description: "Could not find listing details. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        const totalPrice = listing.price * 30; // 30 days * daily price
        
        // Create booking data
        const bookingData = {
          listingId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          totalPrice: totalPrice,
        };
        
        console.log('Sending booking data:', bookingData);
        
        // Call API to add booking
        const result = await addBooking(bookingData);
        console.log('Booking result:', result);
        
        // Update UI state
        setBookings(prev => [...prev, id]);
        setBookingStatuses(prev => ({...prev, [id]: 'pending'}));
        
        toast({
          title: "Booking requested",
          description: "Your booking request has been sent successfully.",
        });
      }
    } catch (error) {
      console.error('Error toggling booking:', error);
      
      // Show detailed error message
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to process booking request';
      
      toast({
        title: "Booking Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    userData,
    setUserData,
    searchQuery,
    setSearchQuery,
    isProfileComplete,
    filteredListings,
    favorites,
    bookings,
    bookingStatuses,
    accommodationListings,
    isLoading,
    error,
    handleLogout,
    handleDeleteAccount,
    toggleFavorite,
    toggleBooking
  };
};

