import React from 'react';
import { Heart, Calendar, Phone, Mail, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { GlassPopoverContent } from '@/components/ui/glass-popup';
import { GlassCard } from '@/components/ui/glass-card';

export interface AccommodationCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  location: string;
  owner: string;
  facilities: string[];
  nearby: string[];
  address: string;
  ownerPhone: string;
  ownerEmail: string;
}

interface Props extends AccommodationCardProps {
  isFavorite?: boolean;
  isBooked?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onBookingToggle?: (id: string) => void;
  bookingStatus?: 'pending' | 'confirmed' | 'cancelled';
}

const AccommodationCard: React.FC<Props> = ({
  id,
  name,
  image,
  price,
  location,
  owner,
  facilities,
  nearby,
  address,
  ownerPhone,
  ownerEmail,
  isFavorite = false,
  isBooked = false,
  onFavoriteToggle,
  onBookingToggle,
  bookingStatus
}) => {
  return (
    <GlassCard className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover rounded-t-xl"
        />
        {onFavoriteToggle && (
          <button 
            onClick={() => onFavoriteToggle(id)}
            className="absolute top-2 right-2 p-2 rounded-full glassmorphic dark:glassmorphic-dark hover:scale-110 transition-all"
          >
            <Heart 
              size={20} 
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} 
            />
          </button>
        )}
        {bookingStatus && (
          <span
            className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium glassmorphic dark:glassmorphic-dark border border-white/20
              ${bookingStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : ''}
              ${bookingStatus === 'confirmed' ? 'bg-green-500/20 text-green-500' : ''}
              ${bookingStatus === 'cancelled' ? 'bg-red-500/20 text-red-500' : ''}
              shadow-lg animate-fade-in`}
            style={{zIndex: 10}}
          >
            {bookingStatus === 'pending' && 'Pending'}
            {bookingStatus === 'confirmed' && 'Accepted'}
            {bookingStatus === 'cancelled' && 'Rejected'}
          </span>
        )}
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-2 flex items-center">
          <MapPin size={14} className="mr-1" /> {location}
        </p>
        <p className="font-bold text-lg mb-3">₹{price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {facilities.slice(0, 3).map((facility, index) => (
            <span key={index} className="text-xs px-2 py-1 rounded-full glassmorphic dark:glassmorphic-dark">
              {facility}
            </span>
          ))}
          {facilities.length > 3 && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs px-2 py-1 rounded-full glassmorphic dark:glassmorphic-dark hover:bg-white/20 transition-all">
                  +{facilities.length - 3} more
                </button>
              </PopoverTrigger>
              <GlassPopoverContent variant="dark" className="w-64">
                <h4 className="font-semibold mb-2">All Facilities</h4>
                <div className="flex flex-wrap gap-1">
                  {facilities.map((facility, index) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-full glassmorphic dark:glassmorphic-dark flex items-center">
                      <Check size={10} className="mr-1" /> {facility}
                    </span>
                  ))}
                </div>
              </GlassPopoverContent>
            </Popover>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {nearby.slice(0, 2).map((place, index) => (
            <span key={index} className="text-xs px-2 py-1 rounded-full glassmorphic dark:glassmorphic-dark">
              Near {place}
            </span>
          ))}
          {nearby.length > 2 && (
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs px-2 py-1 rounded-full glassmorphic dark:glassmorphic-dark hover:bg-white/20 transition-all">
                  +{nearby.length - 2} more
                </button>
              </PopoverTrigger>
              <GlassPopoverContent variant="dark" className="w-64">
                <h4 className="font-semibold mb-2">Nearby Places</h4>
                <div className="flex flex-wrap gap-1">
                  {nearby.map((place, index) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-full glassmorphic dark:glassmorphic-dark flex items-center">
                      <MapPin size={10} className="mr-1" /> {place}
                    </span>
                  ))}
                </div>
              </GlassPopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
      <div className="p-4 pt-0 mt-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full mb-2 glassmorphic dark:glassmorphic-dark hover:bg-white/20">
              Contact Owner
            </Button>
          </PopoverTrigger>
          <GlassPopoverContent variant="dark" className="w-72">
            <h4 className="font-semibold mb-2">{owner}</h4>
            <div className="space-y-2">
              <p className="text-sm flex items-center">
                <Phone size={14} className="mr-2" /> {ownerPhone}
              </p>
              <p className="text-sm flex items-center">
                <Mail size={14} className="mr-2" /> {ownerEmail}
              </p>
              <p className="text-sm flex items-center">
                <MapPin size={14} className="mr-2" /> {address}
              </p>
            </div>
          </GlassPopoverContent>
        </Popover>
        
        {onBookingToggle && (
          <Button 
            onClick={() => onBookingToggle(id)} 
            variant={isBooked ? "outline" : "default"}
            size="sm"
            className={`w-full ${isBooked ? 'glassmorphic dark:glassmorphic-dark' : ''}`}
          >
            <Calendar size={16} className="mr-2" />
            {isBooked ? 'Cancel Booking' : 'Book Now'}
          </Button>
        )}
      </div>
    </GlassCard>
  );
};

export default AccommodationCard;
