
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building, Calendar, User } from 'lucide-react';
import { UserData } from '@/hooks/useOwnerDashboard';
import { useNavbarState } from '../hooks/useNavbarState';

interface OwnerMobileNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  handleLogout: () => void;
  handleDeleteAccount: () => void;
}

const OwnerMobileNavbar = ({ 
  activeTab, 
  setActiveTab, 
  userData, 
  setUserData,
  handleLogout,
  handleDeleteAccount
}: OwnerMobileNavbarProps) => {
  const { isScrolling } = useNavbarState();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Only show navbar on dashboard pages
  const isDashboardPage = location.pathname.includes('dashboard');
  
  if (!isDashboardPage) {
    return null;
  }

  // Handle tab change for all tabs including profile
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    
    // Navigate to the appropriate route with query parameters
    navigate(`/owner-dashboard?tab=${tabName}`);
  };

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 md:hidden flex justify-center px-4">
      <div className={`flex items-center justify-around transition-all duration-300 ease-in-out glassmorphic dark:glassmorphic-dark rounded-full shadow-glass-sm ${
        isScrolling ? "w-[95%] py-2" : "w-[95%] py-3"
      }`}>
        <button 
          className={`flex items-center justify-center p-2.5 rounded-full ${
            activeTab === 'dashboard' ? "bg-white/20 text-foreground" : "text-foreground/70 hover:text-foreground"
          }`}
          onClick={() => handleTabChange('dashboard')}
          id="dashboard-tab"
          aria-label="Dashboard"
        >
          <LayoutDashboard size={22} />
        </button>
        
        <button 
          className={`flex items-center justify-center p-2.5 rounded-full ${
            activeTab === 'properties' ? "bg-white/20 text-foreground" : "text-foreground/70 hover:text-foreground"
          }`}
          onClick={() => handleTabChange('properties')}
          id="properties-tab"
          aria-label="Properties"
        >
          <Building size={22} />
        </button>
        
        <button 
          className={`flex items-center justify-center p-2.5 rounded-full ${
            activeTab === 'bookings' ? "bg-white/20 text-foreground" : "text-foreground/70 hover:text-foreground"
          }`}
          onClick={() => handleTabChange('bookings')}
          id="bookings-tab"
          aria-label="Bookings"
        >
          <Calendar size={22} />
        </button>
        
        {/* Changed from Sheet to regular button */}
        <button
          className={`flex items-center justify-center p-2.5 rounded-full ${
            activeTab === 'profile' ? "bg-white/20 text-foreground" : "text-foreground/70 hover:text-foreground"
          }`}
          id="profile-tab"
          onClick={() => handleTabChange('profile')}
          aria-label="Profile"
        >
          <User size={22} />
        </button>
      </div>
    </div>
  );
};

export default OwnerMobileNavbar;
