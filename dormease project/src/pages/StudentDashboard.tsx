import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import DashboardLayout from '@/components/DashboardLayout';
import HomeTab from '@/components/HomeTab';
import FavoritesTab from '@/components/FavoritesTab';
import BookingsTab from '@/components/BookingsTab';
import ProfileContent from '@/components/ProfileContent';
import { AccommodationCardProps } from '@/types/accommodation';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activeTab,
    setActiveTab,
    userData,
    setUserData,
    searchQuery,
    setSearchQuery,
    isProfileComplete,
    filteredListings,
    favorites,
    bookings,
    bookingStatuses,
    isLoading,
    error,
    handleLogout,
    handleDeleteAccount,
    toggleFavorite,
    toggleBooking
  } = useStudentDashboard();

  // Check for user authentication and role
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth?type=student');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.userType !== 'student') {
      console.log('Invalid user type, redirecting to auth');
      navigate('/auth?type=student');
      return;
    }

    // Extract tab from URL query parameters
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam) {
      console.log('Setting active tab from URL:', tabParam);
      setActiveTab(tabParam);
    }
  }, [location.search, navigate, setActiveTab]);

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-secondary/10">
        <div className="glassmorphic dark:glassmorphic-dark p-8 rounded-xl border border-white/20 text-center">
          <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-secondary/10">
        <div className="glassmorphic dark:glassmorphic-dark p-8 rounded-xl border border-white/20 text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userData={userData}
      setUserData={setUserData}
      isProfileComplete={isProfileComplete}
      handleLogout={handleLogout}
      handleDeleteAccount={handleDeleteAccount}
    >
      {/* Tab Content */}
      {activeTab === 'home' && (
        <HomeTab
          userData={userData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          listings={filteredListings}
          favorites={favorites}
          bookings={bookings}
          bookingStatuses={bookingStatuses}
          onFavoriteToggle={toggleFavorite}
          onBookingToggle={toggleBooking}
        />
      )}
      {activeTab === 'favorites' && (
        <FavoritesTab
          listings={filteredListings}
          favorites={favorites}
          bookings={bookings}
          bookingStatuses={bookingStatuses}
          onFavoriteToggle={toggleFavorite}
          onBookingToggle={toggleBooking}
        />
      )}
      {activeTab === 'bookings' && (
        <BookingsTab
          listings={filteredListings}
          bookings={bookings}
          bookingStatuses={bookingStatuses}
          onBookingToggle={toggleBooking}
        />
      )}
      {activeTab === 'profile' && (
        <div className="p-6 max-w-4xl mx-auto">
          <ProfileContent
            userData={userData}
            setUserData={setUserData}
            handleLogout={handleLogout}
            handleDeleteAccount={handleDeleteAccount}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
