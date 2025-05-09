
import React from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleUserTypeSelection = (type: 'student' | 'owner') => {
    // Navigate to the appropriate authentication page
    navigate(`/auth?type=${type}`);
  };

  const isDark = theme === 'dark';

  return (
    <section className={cn('min-h-screen w-full flex items-center justify-center px-4 md:px-8 py-20', className)}>
      <div className="container mx-auto">
        <div className="w-full flex flex-col items-center md:flex-row md:items-start md:justify-between gap-12">
          {/* Left side - Floating Image removed */}
          <div className="w-full md:w-5/12 flex justify-center md:justify-start hidden md:block">
            <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float hover:scale-110 transition-transform duration-300">
              <div className={`absolute inset-0 rounded-full blur-xl opacity-70 ${isDark ? 'bg-gradient-to-br from-secondary/30 to-primary/10' : 'bg-gradient-to-br from-white/30 to-white/10'}`}></div>
              <div className={`absolute inset-2 rounded-full flex items-center justify-center ${isDark ? 'dark-glassmorphic' : 'light-glassmorphic'}`}>
                {/* Image removed */}
              </div>
              <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full blur-md animate-pulse-soft ${isDark ? 'bg-gradient-to-br from-primary/20 to-secondary/10' : 'bg-gradient-to-br from-white/30 to-white/20'}`}></div>
              <div className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-md animate-pulse-soft ${isDark ? 'bg-gradient-to-tr from-secondary/20 to-primary/10' : 'bg-gradient-to-tr from-white/30 to-white/20'}`} style={{animationDelay: '1s'}}></div>
            </div>
          </div>
          
          {/* Right side - Text content */}
          <div className="w-full md:w-7/12 flex flex-col items-center md:items-start text-center md:text-left">
            <span className={`inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-medium font-dm-sans backdrop-blur-xs animate-fade-down opacity-0 ${isDark ? 'dark-glassmorphic' : 'light-glassmorphic'} ${isDark ? 'dark-text-primary' : 'light-text-primary'}`} style={{animationDelay: '0.1s'}}>
              STUDENT HOUSING REIMAGINED
            </span>
            
            <div className="relative mb-6">
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold font-boldoni leading-tight animate-fade-down opacity-0 ${isDark ? 'dark-text-primary' : 'light-text-primary'}`} style={{animationDelay: '0.15s'}}>
                Student's
              </h1>
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold font-boldoni leading-tight animate-fade-down opacity-0 ${isDark ? 'dark-text-primary' : 'light-text-primary'}`} style={{animationDelay: '0.2s'}}>
                Accommodation
              </h1>
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold font-boldoni leading-tight animate-fade-down opacity-0 ${isDark ? 'dark-text-primary' : 'light-text-primary'}`} style={{animationDelay: '0.25s'}}>
                Platform
              </h1>
            </div>
            
            <p className={`max-w-xl text-lg md:text-xl font-dm-sans font-light mb-8 animate-fade-down opacity-0 ${isDark ? 'dark-text-secondary' : 'light-text-secondary'}`} style={{animationDelay: '0.3s'}}>
              Discover your perfect student home with our seamless platform that connects students with property owners for a stress-free housing experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-down opacity-0" style={{animationDelay: '0.35s'}}>
              <UserTypeButton 
                type="student" 
                onClick={() => handleUserTypeSelection('student')} 
                isDark={isDark}
              />
              <UserTypeButton 
                type="owner" 
                onClick={() => handleUserTypeSelection('owner')} 
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface UserTypeButtonProps {
  type: 'student' | 'owner';
  onClick: () => void;
  isDark: boolean;
}

const UserTypeButton: React.FC<UserTypeButtonProps> = ({ type, onClick, isDark }) => {
  return (
    <button 
      onClick={onClick}
      className={`button-ripple px-8 py-3 rounded-full font-dm-sans font-medium text-base transition-all duration-200 relative overflow-hidden group
      ${isDark ? 'dark-glassmorphic' : 'light-glassmorphic'} hover:shadow-neon-hover`}
    >
      <span className={`relative z-10 flex items-center justify-center ${isDark ? 'dark-text-primary' : 'light-text-primary'}`}>
        {type === 'student' ? 'I am a Student' : 'I am an Owner'}
      </span>
      <span className="absolute inset-0 w-full h-full bg-white/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
    </button>
  );
};

export default Hero;
