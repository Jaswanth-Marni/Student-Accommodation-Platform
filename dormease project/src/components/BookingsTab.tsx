import React from 'react';
import { Calendar } from 'lucide-react';
import AccommodationCard from './AccommodationCard';
import { AccommodationCardProps } from '@/types/accommodation';

interface BookingsTabProps {
  listings: AccommodationCardProps[];
  bookings: string[];
  onBookingToggle: (id: string) => void;
  bookingStatuses: Record<string, 'pending' | 'confirmed' | 'cancelled'>;
}

const BookingsTab = ({
  listings,
  bookings,
  onBookingToggle,
  bookingStatuses
}: BookingsTabProps) => {
  // Filter listings to show only booked accommodations
  const bookedListings = listings.filter(listing => bookings.includes(listing.id));

  if (bookedListings.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full glassmorphic dark:glassmorphic-dark flex items-center justify-center">
            <Calendar size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
          <p className="text-muted-foreground mb-4">
            Start booking accommodations to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Bookings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookedListings.map((listing, index) => (
          <div key={listing.id} className="animate-fade-up" style={{animationDelay: `${0.1 + index * 0.1}s`}}>
            <AccommodationCard
              {...listing}
              isBooked={true}
              onBookingToggle={() => onBookingToggle(listing.id)}
              bookingStatus={bookingStatuses[listing.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsTab;
