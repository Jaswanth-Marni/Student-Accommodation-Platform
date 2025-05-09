
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun } from "lucide-react";
import { StudentNavItems, OwnerNavItems } from "./NavItems";
import { useNavbarState } from "../hooks/useNavbarState";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  userType?: 'student' | 'owner';
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userType, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isScrolling } = useNavbarState();
  const { theme, setTheme } = useTheme();
  
  // Only show navbar on dashboard pages
  const isDashboardPage = location.pathname.includes('dashboard');
  
  if (!isDashboardPage && !userType) {
    return null;
  }

  // Add back the theme toggle function
  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior - navigate to landing page
      navigate("/");
    }
  };

  return (
    <div className="fixed top-5 left-0 right-0 z-50 flex justify-center">
      <nav
        className={`transition-all duration-300 glassmorphic dark:glassmorphic-dark rounded-full ${
          isScrolling ? "w-[95%] py-2" : "w-[85%] py-3"
        } mx-auto ${window.innerWidth >= 1280 ? "max-w-4xl" : ""}`}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <div 
            className={`font-boldoni text-gradient transition-all duration-300 ${
              isScrolling ? "text-lg md:text-xl" : "text-xl md:text-2xl"
            }`}
          >
            DormEase
          </div>
          
          <div className="hidden md:flex md:items-center md:gap-x-4">
            {userType === 'owner' && <OwnerNavItems navigate={navigate} />}
            {userType === 'student' && <StudentNavItems navigate={navigate} />}
            {!userType && isDashboardPage && <StudentNavItems navigate={navigate} />}
          </div>

          <div className="flex items-center gap-x-2">
            <Button 
              onClick={handleThemeToggle}
              variant="ghost" 
              size="icon"
              className="rounded-full p-2 glassmorphic dark:glassmorphic-dark hover:bg-white/20 text-foreground"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            
            {isDashboardPage && (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="rounded-full p-2 glassmorphic dark:glassmorphic-dark hover:bg-white/20 text-foreground"
              >
                <LogOut size={18} />
              </Button>
            )}
            
            {!isDashboardPage && (
              <div className="flex items-center gap-x-2">
                <button
                  onClick={() => navigate("/auth", { state: { type: "login" } })}
                  className="px-3 py-1.5 rounded-pill text-sm flex items-center gap-1.5 font-medium glassmorphic dark:glassmorphic-dark bg-white/5 hover:bg-white/10 transition-all button-ripple hover:scale-105 active:scale-95"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/auth", { state: { type: "signup" } })}
                  className="px-3 py-1.5 rounded-pill text-sm flex items-center gap-1.5 font-medium glassmorphic dark:glassmorphic-dark bg-white/5 hover:bg-white/10 transition-all button-ripple hover:scale-105 active:scale-95"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
