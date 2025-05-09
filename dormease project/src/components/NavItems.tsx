
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Heart, Calendar, User, LayoutDashboard, Building } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick, className, isActive }) => {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 font-medium transition-all ${
        isActive 
          ? 'bg-primary/20 text-primary hover:bg-primary/30' 
          : 'glassmorphic dark:glassmorphic-dark bg-white/10 hover:bg-white/20 text-foreground/80 hover:text-foreground'
      } hover:scale-105 active:scale-95 ${className || ''}`}
    >
      {icon}
      <span className="font-dm-sans">{label}</span>
    </button>
  );
};

interface NavItemsProps {
  navigate: ReturnType<typeof useNavigate>;
}

export const StudentNavItems: React.FC<NavItemsProps> = ({ navigate }) => {
  const location = useLocation();
  
  // Add useEffect to sync the active tab with the current URL on component mount
  useEffect(() => {
    // Extract the tab from the URL or use default
    let currentTab = 'home';
    if (location.pathname === '/student-dashboard') {
      // Check if there's a hash or query param indicating the tab
      const urlParams = new URLSearchParams(location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) {
        currentTab = tabParam;
      }
    }
    
    // Set the active tab in localStorage
    localStorage.setItem('studentActiveTab', currentTab);
  }, [location.pathname, location.search]);
  
  const handleHomeNavigation = () => {
    localStorage.setItem('studentActiveTab', 'home');
    navigate('/student-dashboard?tab=home');
  };

  const handleFavoritesNavigation = () => {
    localStorage.setItem('studentActiveTab', 'favorites');
    navigate('/student-dashboard?tab=favorites');
  };

  const handleBookingsNavigation = () => {
    localStorage.setItem('studentActiveTab', 'bookings');
    navigate('/student-dashboard?tab=bookings');
  };

  const handleProfileNavigation = () => {
    localStorage.setItem('studentActiveTab', 'profile');
    navigate('/student-dashboard?tab=profile');
  };

  // Determine which tab should be active based on localStorage
  const getActiveTab = () => {
    const activeTab = localStorage.getItem('studentActiveTab');
    return activeTab || 'home';
  };

  const activeTab = getActiveTab();

  return (
    <div className="flex items-center gap-x-3">
      <NavItem 
        icon={<Home size={16} />} 
        label="Home"
        onClick={handleHomeNavigation}
        isActive={activeTab === 'home'}
      />
      <NavItem 
        icon={<Heart size={16} />} 
        label="Favorites" 
        onClick={handleFavoritesNavigation}
        isActive={activeTab === 'favorites'}
      />
      <NavItem 
        icon={<Calendar size={16} />} 
        label="Bookings" 
        onClick={handleBookingsNavigation}
        isActive={activeTab === 'bookings'}
      />
      <NavItem 
        icon={<User size={16} />} 
        label="Profile" 
        onClick={handleProfileNavigation}
        isActive={activeTab === 'profile'}
      />
    </div>
  );
};

export const OwnerNavItems: React.FC<NavItemsProps> = ({ navigate }) => {
  const location = useLocation();
  
  // Add useEffect to sync the active tab with the current URL on component mount
  useEffect(() => {
    // Extract the tab from the URL or use default
    let currentTab = 'dashboard';
    if (location.pathname === '/owner-dashboard') {
      // Check if there's a hash or query param indicating the tab
      const urlParams = new URLSearchParams(location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) {
        currentTab = tabParam;
      }
    }
    
    // Set the active tab in localStorage
    localStorage.setItem('ownerActiveTab', currentTab);
  }, [location.pathname, location.search]);

  const handleDashboardClick = () => {
    localStorage.setItem('ownerActiveTab', 'dashboard');
    navigate('/owner-dashboard?tab=dashboard');
  };

  const handlePropertiesClick = () => {
    localStorage.setItem('ownerActiveTab', 'properties');
    navigate('/owner-dashboard?tab=properties');
  };

  const handleBookingsClick = () => {
    localStorage.setItem('ownerActiveTab', 'bookings');
    navigate('/owner-dashboard?tab=bookings');
  };

  const handleProfileClick = () => {
    localStorage.setItem('ownerActiveTab', 'profile');
    navigate('/owner-dashboard?tab=profile');
  };

  // Determine which tab should be active based on localStorage
  const getActiveTab = () => {
    const activeTab = localStorage.getItem('ownerActiveTab');
    return activeTab || 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <div className="flex items-center gap-x-3">
      <NavItem 
        icon={<LayoutDashboard size={16} />} 
        label="Dashboard"
        onClick={handleDashboardClick}
        isActive={activeTab === 'dashboard'}
      />
      <NavItem 
        icon={<Building size={16} />} 
        label="Properties" 
        onClick={handlePropertiesClick}
        isActive={activeTab === 'properties'}
      />
      <NavItem 
        icon={<Calendar size={16} />} 
        label="Bookings" 
        onClick={handleBookingsClick}
        isActive={activeTab === 'bookings'}
      />
      <NavItem 
        icon={<User size={16} />} 
        label="Profile" 
        onClick={handleProfileClick}
        isActive={activeTab === 'profile'}
      />
    </div>
  );
};
