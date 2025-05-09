
import React from 'react';
import { OwnerBooking, OwnerProperty } from '@/hooks/useOwnerDashboard';
import { User, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OwnerBookingsTabProps {
  bookings: OwnerBooking[];
  properties: OwnerProperty[];
  updateBookingStatus: (id: string, status: OwnerBooking['status']) => void;
}

const OwnerBookingsTab: React.FC<OwnerBookingsTabProps> = ({ bookings, properties, updateBookingStatus }) => {
  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-founders mb-2">Bookings</h1>
        <p className="text-muted-foreground">Manage your property bookings</p>
      </div>
      
      <Tabs defaultValue="all" className="w-full animate-fade-up">
        <TabsList className="glassmorphic dark:glassmorphic-dark border border-white/20 px-2 py-1 rounded-pill w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="all" className="rounded-pill">All Bookings</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-pill">Pending</TabsTrigger>
          <TabsTrigger value="confirmed" className="rounded-pill">Confirmed</TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-pill">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <BookingsList 
            bookings={bookings} 
            properties={properties} 
            updateBookingStatus={updateBookingStatus} 
            showEmpty={bookings.length === 0}
          />
        </TabsContent>
        
        <TabsContent value="pending">
          <BookingsList 
            bookings={pendingBookings} 
            properties={properties} 
            updateBookingStatus={updateBookingStatus} 
            showEmpty={pendingBookings.length === 0}
            emptyMessage="No pending booking requests"
          />
        </TabsContent>
        
        <TabsContent value="confirmed">
          <BookingsList 
            bookings={confirmedBookings} 
            properties={properties} 
            updateBookingStatus={updateBookingStatus} 
            showEmpty={confirmedBookings.length === 0}
            emptyMessage="No confirmed bookings"
          />
        </TabsContent>
        
        <TabsContent value="cancelled">
          <BookingsList 
            bookings={cancelledBookings} 
            properties={properties} 
            updateBookingStatus={updateBookingStatus} 
            showEmpty={cancelledBookings.length === 0}
            emptyMessage="No cancelled bookings"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface BookingsListProps {
  bookings: OwnerBooking[];
  properties: OwnerProperty[];
  updateBookingStatus: (id: string, status: OwnerBooking['status']) => void;
  showEmpty: boolean;
  emptyMessage?: string;
}

const BookingsList: React.FC<BookingsListProps> = ({ 
  bookings, 
  properties, 
  updateBookingStatus, 
  showEmpty,
  emptyMessage = "No bookings yet" 
}) => {
  if (showEmpty) {
    return (
      <div className="glassmorphic dark:glassmorphic-dark rounded-xl p-6 border border-white/20 text-center py-12">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">{emptyMessage}</h3>
        <p className="text-muted-foreground">Bookings will appear here once students request to book your properties</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {bookings.map((booking, index) => {
        const property = properties.find(p => p.id === booking.propertyId);
        return (
          <div 
            key={booking.id} 
            className="glassmorphic dark:glassmorphic-dark rounded-xl p-5 border border-white/20 animate-fade-up"
            style={{animationDelay: `${0.1 + index * 0.1}s`}}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  booking.status === 'confirmed' ? 'bg-green-500/20' : 
                  booking.status === 'pending' ? 'bg-yellow-500/20' : 
                  'bg-red-500/20'
                }`}>
                  <User className={`h-6 w-6 ${
                    booking.status === 'confirmed' ? 'text-green-500' : 
                    booking.status === 'pending' ? 'text-yellow-500' : 
                    'text-red-500'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{booking.studentName}</h3>
                  <p className="text-sm text-muted-foreground">{booking.studentEmail}</p>
                </div>
              </div>
              
              <div className="flex-grow md:text-center">
                <p className="text-sm font-medium">{property?.name || 'Unknown property'}</p>
                <p className="text-xs text-muted-foreground">{property?.location || ''}</p>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-1 ${
                  booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 
                  booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                  'bg-red-500/20 text-red-500'
                }`}>
                  {booking.status}
                </div>
                <p className="text-xs">
                  {booking.checkIn} <span className="mx-1">→</span> {booking.checkOut}
                </p>
              </div>
            </div>
            
            {booking.status === 'pending' && (
              <div className="flex justify-end mt-4 gap-2">
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  className="h-8 rounded-pill"
                >
                  <X className="mr-1 h-3 w-3" />
                  Decline
                </Button>
                <Button 
                  size="sm"
                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                  className="h-8 rounded-pill"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Accept
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OwnerBookingsTab;
