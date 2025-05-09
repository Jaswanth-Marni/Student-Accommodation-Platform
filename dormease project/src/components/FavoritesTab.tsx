import React from 'react';
import { Heart } from 'lucide-react';
import AccommodationCard from './AccommodationCard';
import { AccommodationCardProps } from '@/types/accommodation';

interface FavoritesTabProps {
  listings: AccommodationCardProps[];
  favorites: string[];
  bookings: string[];
  onFavoriteToggle: (id: string) => void;
  onBookingToggle: (id: string) => void;
  bookingStatuses: Record<string, 'pending' | 'confirmed' | 'cancelled'>;
}

const FavoritesTab = ({
  listings,
  favorites,
  bookings,
  onFavoriteToggle,
  onBookingToggle,
  bookingStatuses
}: FavoritesTabProps) => {
  // Filter listings to show only favorites
  const favoriteListings = listings.filter(listing => favorites.includes(listing.id));

  if (favoriteListings.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full glassmorphic dark:glassmorphic-dark flex items-center justify-center">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-4">
            Start adding accommodations to your favorites to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold font-founders">
          Your Favorite Accommodations
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteListings.map((listing, index) => (
            <div key={listing.id} className="animate-fade-up hover-scale-subtle" style={{animationDelay: `${0.1 + index * 0.1}s`}}>
              <AccommodationCard 
                {...listing} 
                isFavorite={true}
                isBooked={bookings.includes(listing.id)}
                onFavoriteToggle={() => onFavoriteToggle(listing.id)}
                onBookingToggle={() => onBookingToggle(listing.id)}
                bookingStatus={bookingStatuses[listing.id]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesTab;
