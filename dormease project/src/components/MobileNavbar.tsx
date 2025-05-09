
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Heart, Calendar, User } from "lucide-react";
import { useNavbarState } from "../hooks/useNavbarState";

interface MobileNavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  userData?: any;
  setUserData?: React.Dispatch<React.SetStateAction<any>>;
  handleLogout?: () => void;
  handleDeleteAccount?: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  activeTab,
  setActiveTab,
  userData,
  setUserData,
  handleLogout,
  handleDeleteAccount
}) => {
  const { isScrolling } = useNavbarState();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Only show navbar on dashboard pages
  const isDashboardPage = location.pathname.includes('dashboard');
  
  if (!isDashboardPage) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 md:hidden flex justify-center px-4">
      <div
        className={`flex items-center justify-around transition-all duration-300 ease-in-out glassmorphic dark:glassmorphic-dark rounded-full shadow-glass-sm ${
          isScrolling ? "w-[95%] py-2" : "w-[95%] py-3"
        }`}
      >
        <button
          onClick={() => {
            navigate("/student-dashboard");
            if (setActiveTab) setActiveTab('home');
          }}
          className={`flex items-center justify-center p-2.5 rounded-full ${
            location.pathname === "/student-dashboard" && activeTab === 'home'
              ? "bg-white/30 text-foreground" 
              : "text-foreground/70 hover:text-foreground"
          }`}
          aria-label="Home"
        >
          <Home size={22} />
        </button>

        <button
          onClick={() => {
            navigate("/student-dashboard");
            if (setActiveTab) setActiveTab('favorites');
          }}
          className={`flex items-center justify-center p-2.5 rounded-full ${
            location.pathname === "/student-dashboard" && activeTab === 'favorites'
              ? "bg-white/30 text-foreground" 
              : "text-foreground/70 hover:text-foreground"
          }`}
          aria-label="Favorites"
        >
          <Heart size={22} />
        </button>

        <button
          onClick={() => {
            navigate("/student-dashboard");
            if (setActiveTab) setActiveTab('bookings');
          }}
          className={`flex items-center justify-center p-2.5 rounded-full ${
            location.pathname === "/student-dashboard" && activeTab === 'bookings'
              ? "bg-white/30 text-foreground" 
              : "text-foreground/70 hover:text-foreground"
          }`}
          aria-label="Bookings"
        >
          <Calendar size={22} />
        </button>

        <button
          onClick={() => {
            navigate("/student-dashboard");
            if (setActiveTab) setActiveTab('profile');
          }}
          className={`flex items-center justify-center p-2.5 rounded-full ${
            location.pathname === "/student-dashboard" && activeTab === 'profile'
              ? "bg-white/30 text-foreground" 
              : "text-foreground/70 hover:text-foreground"
          }`}
          aria-label="Profile"
        >
          <User size={22} />
        </button>
      </div>
    </div>
  );
};

export default MobileNavbar;
