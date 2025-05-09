
import React from 'react';
import { Building, Users, BarChart, PiggyBank, ArrowUpRight } from 'lucide-react';
import { OwnerProperty, OwnerBooking, UserData } from '@/hooks/useOwnerDashboard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, trend }) => {
  return (
    <div className="glassmorphic dark:glassmorphic-dark rounded-xl p-4 border border-white/20 hover:shadow-neon-hover transition-all hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <span className="text-muted-foreground text-sm">{title}</span>
        <span className="p-2 rounded-full bg-primary/10">{icon}</span>
      </div>
      <div className="font-bold text-2xl mb-2">{value}</div>
      {change && (
        <div className={`text-xs flex items-center ${
          trend === 'up' ? 'text-green-500' : 
          trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
        }`}>
          {trend === 'up' && <ArrowUpRight className="mr-1 h-3 w-3" />}
          {trend === 'down' && <ArrowUpRight className="mr-1 h-3 w-3 rotate-90" />}
          {change}
        </div>
      )}
    </div>
  );
};

interface OwnerDashboardTabProps {
  properties: OwnerProperty[];
  bookings: OwnerBooking[];
  userData: UserData | null;
}

const OwnerDashboardTab: React.FC<OwnerDashboardTabProps> = ({ 
  properties, 
  bookings, 
  userData 
}) => {
  const activeProperties = properties.filter(p => p.status === 'active').length;
  const pendingProperties = properties.filter(p => p.status === 'pending').length;
  
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  
  const totalRevenue = properties.reduce((sum, property) => {
    const propertyBookings = bookings.filter(
      b => b.propertyId === property.id && b.status === 'confirmed'
    ).length;
    return sum + (property.price * propertyBookings);
  }, 0);

  // Get properties sorted by date (newest first) for display
  const recentProperties = [...properties].sort((a, b) => {
    // This is a mock sorting as we don't have actual date fields
    // In a real app, you'd sort by creation date
    return b.id.localeCompare(a.id);
  }).slice(0, 3);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-founders mb-2">Welcome back, {userData?.name || 'Owner'}</h1>
        <p className="text-muted-foreground">Here's what's happening with your properties today.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Properties" 
          value={properties.length} 
          icon={<Building size={18} />} 
          change={activeProperties > 0 ? `${activeProperties} active` : "No active properties"}
          trend={activeProperties > 0 ? 'up' : 'neutral'}
        />
        <StatCard 
          title="Total Bookings" 
          value={bookings.length} 
          icon={<Users size={18} />} 
          change={pendingBookings > 0 ? `${pendingBookings} pending` : "No pending bookings"}
          trend={pendingBookings > 0 ? 'neutral' : 'up'}
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${properties.length > 0 ? Math.round((confirmedBookings / properties.length) * 100) : 0}%`} 
          icon={<BarChart size={18} />} 
          change="Based on confirmed bookings"
          trend="neutral"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          icon={<PiggyBank size={18} />} 
          change="From confirmed bookings"
          trend="up"
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProperties.map((property, index) => (
            <div 
              key={property.id} 
              className="glassmorphic dark:glassmorphic-dark rounded-xl overflow-hidden border border-white/20 animate-fade-up"
              style={{animationDelay: `${0.1 + index * 0.1}s`}}
            >
              <div className="h-36 relative">
                <img 
                  src={property.image} 
                  alt={property.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <div className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-1 ${
                    property.status === 'active' ? 'bg-green-500/30 text-green-200' : 
                    property.status === 'inactive' ? 'bg-gray-500/30 text-gray-200' : 
                    'bg-yellow-500/30 text-yellow-200'
                  }`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </div>
                  <h3 className="text-white font-semibold truncate">{property.name}</h3>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground truncate">{property.location}</p>
                  <p className="text-sm font-semibold">₹{property.price}/mo</p>
                </div>
                
                {property.facilities?.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {property.facilities.slice(0, 2).map((facility, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-primary/10 rounded-full">{facility}</span>
                      ))}
                      {property.facilities.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 rounded-full">+{property.facilities.length - 2}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="glassmorphic dark:glassmorphic-dark rounded-xl border border-white/20 overflow-hidden animate-fade-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Property</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Student</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check In</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check Out</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => {
                  const property = properties.find(p => p.id === booking.propertyId);
                  return (
                    <tr key={booking.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm">{property?.name || 'Unknown Property'}</td>
                      <td className="p-4 text-sm">{booking.studentName}</td>
                      <td className="p-4 text-sm">{booking.checkIn}</td>
                      <td className="p-4 text-sm">{booking.checkOut}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300' : 
                          booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300' : 
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No bookings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardTab;
