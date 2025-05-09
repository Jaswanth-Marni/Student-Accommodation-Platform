
import React from 'react';

interface NavbarButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  large?: boolean;
  id?: string;
  rounded?: boolean;
  hideLabel?: boolean;
  className?: string;
}

const NavbarButton = ({ 
  icon, 
  label, 
  isActive, 
  onClick, 
  large = false, 
  id, 
  rounded = true,
  hideLabel = false,
  className = ''
}: NavbarButtonProps) => {
  if (large) {
    return (
      <button
        id={id}
        onClick={onClick}
        className={`flex items-center px-4 py-3 rounded-full transition-colors ${
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:bg-secondary/30 hover:text-foreground'
        } transition-all hover:scale-105 active:scale-95 ${className}`}
      >
        <div className="mr-3">{icon}</div>
        {!hideLabel && <span>{label}</span>}
      </button>
    );
  }
  
  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-full ${
        isActive ? 'text-primary' : 'text-muted-foreground'
      } transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      <div className={`p-2 rounded-full ${isActive ? 'bg-primary/10' : 'hover:bg-secondary/30'}`}>
        {icon}
      </div>
      {!hideLabel && <span className="text-xs mt-1">{label}</span>}
    </button>
  );
};

export default NavbarButton;
