
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const Index = () => {
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    // Apply smooth scrolling behavior
    document.documentElement.classList.add('smooth-scroll');
    
    return () => {
      document.documentElement.classList.remove('smooth-scroll');
    };
  }, []);

  useEffect(() => {
    // Apply theme-specific background
    if (theme === 'dark') {
      document.body.style.background = 'linear-gradient(135deg, rgba(18, 15, 37, 0.9), rgba(40, 32, 72, 0.8))';
    } else {
      document.body.style.background = 'linear-gradient(135deg, rgba(83, 64, 254, 0.8), rgba(143, 128, 255, 0.6))';
    }
    
    return () => {
      document.body.style.background = '';
    };
  }, [theme]);

  // Add back the theme toggle function
  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Pill-shaped Navbar */}
      <div className="fixed top-5 left-0 right-0 z-50 flex justify-center">
        <div className={`flex items-center justify-between px-6 py-3 rounded-full w-[90%] max-w-4xl 
          ${theme === 'dark' ? 'dark-glassmorphic' : 'light-glassmorphic'}`}>
          <div 
            className="font-boldoni text-2xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 flex items-center"
          >
            <span className={`${theme === 'dark' ? 'dark-text-primary' : 'light-text-primary'}`}>DormEase</span>
          </div>
          
          <button 
            onClick={handleThemeToggle}
            className={`p-2.5 rounded-full ${theme === 'dark' ? 'dark-glassmorphic' : 'light-glassmorphic'} 
            hover:scale-110 active:scale-95 transition-all`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} className="dark-text-primary" /> : <Moon size={20} className="light-text-primary" />}
          </button>
        </div>
      </div>
      
      <main className="w-full relative">
        <Hero />
      </main>
    </div>
  );
};

export default Index;
