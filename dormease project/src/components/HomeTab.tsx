import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AccommodationCard from './AccommodationCard';
import { AccommodationCardProps, UserData } from '@/types/accommodation';
import { bookingStatuses } from '@/types/booking';

interface HomeTabProps {
  userData: UserData | null;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  listings: AccommodationCardProps[];
  favorites: string[];
  bookings: string[];
  onFavoriteToggle: (id: string) => void;
  onBookingToggle: (id: string) => void;
  bookingStatuses: Record<string, 'pending' | 'confirmed' | 'cancelled'>;
}

const HomeTab = ({ 
  userData, 
  searchQuery, 
  setSearchQuery,
  listings,
  favorites,
  bookings,
  onFavoriteToggle,
  onBookingToggle,
  bookingStatuses
}: HomeTabProps) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold font-founders">
            Welcome, {userData?.name || 'Student'}
          </h1>
        </div>
        
        <div className="relative animate-fade-up" style={{animationDelay: '0.1s'}}>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <Input
            placeholder="Search accommodations, amenities, locations..."
            className="pl-10 h-12 rounded-xl glassmorphic dark:glassmorphic-dark border-white/20 transition-all focus:shadow-neon-hover"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <h2 className="text-xl font-semibold font-founders mt-4 animate-fade-up" style={{animationDelay: '0.2s'}}>
          Available Accommodation Listings
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings && listings.length > 0 ? (
            listings.map((listing, index) => (
              <div key={listing.id} className="animate-fade-up hover-scale-subtle" style={{animationDelay: `${0.3 + index * 0.1}s`}}>
                <AccommodationCard 
                  {...listing} 
                  isFavorite={favorites.includes(listing.id)}
                  isBooked={bookings.includes(listing.id)}
                  onFavoriteToggle={() => onFavoriteToggle(listing.id)}
                  onBookingToggle={() => onBookingToggle(listing.id)}
                  bookingStatus={bookingStatuses[listing.id]}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground animate-fade-up glassmorphic dark:glassmorphic-dark rounded-2xl">
              <p className="mb-2">No accommodations match your search criteria.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-primary underline button-ripple"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
