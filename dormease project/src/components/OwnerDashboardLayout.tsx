
import React, { ReactNode } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from '@/components/Navbar';
import OwnerMobileNavbar from '@/components/OwnerMobileNavbar';
import { UserData } from '@/types/accommodation';

interface OwnerDashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  isProfileComplete: boolean;
  handleLogout: () => void;
  handleDeleteAccount: () => void;
}

const OwnerDashboardLayout = ({
  children,
  activeTab,
  setActiveTab,
  userData,
  setUserData,
  isProfileComplete,
  handleLogout,
  handleDeleteAccount
}: OwnerDashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-secondary/10">
      <Navbar userType="owner" />
      
      <main className="min-h-screen pb-20 md:pb-0 pt-24">
        <TransitionGroup>
          <CSSTransition
            key={activeTab}
            timeout={300}
            classNames="tab-transition"
          >
            <div className="animate-fade-up">
              {children}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </main>
      
      <OwnerMobileNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userData={userData} 
        setUserData={setUserData}
        handleLogout={handleLogout}
        handleDeleteAccount={handleDeleteAccount}
      />
      
      {/* Removed profile completion dialog that was triggering on every page change */}
    </div>
  );
};

export default OwnerDashboardLayout;
