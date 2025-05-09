
import React, { ReactNode } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from '@/components/Navbar';
import MobileNavbar from '@/components/MobileNavbar';
import ProfileCompletionDialog from '@/components/ProfileCompletionDialog';
import { UserData } from '@/types/accommodation';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  isProfileComplete: boolean;
  handleLogout: () => void;
  handleDeleteAccount: () => void;
}

const DashboardLayout = ({
  children,
  activeTab,
  setActiveTab,
  userData,
  setUserData,
  isProfileComplete,
  handleLogout,
  handleDeleteAccount
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-secondary/10">
      <Navbar userType="student" />
      
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
      
      <MobileNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userData={userData} 
        setUserData={setUserData}
        handleLogout={handleLogout}
        handleDeleteAccount={handleDeleteAccount}
      />
      
      {/* Only show profile completion dialog on first load when profile is incomplete */}
    </div>
  );
};

export default DashboardLayout;
