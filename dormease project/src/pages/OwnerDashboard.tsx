import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOwnerDashboard } from '@/hooks/useOwnerDashboard';
import OwnerDashboardLayout from '@/components/OwnerDashboardLayout';
import OwnerDashboardTab from '@/components/OwnerDashboardTab';
import OwnerPropertiesTab from '@/components/OwnerPropertiesTab';
import OwnerBookingsTab from '@/components/OwnerBookingsTab';
import ProfileContent from '@/components/ProfileContent';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userData,
    setUserData,
    activeTab,
    setActiveTab,
    properties,
    bookings,
    isLoading,
    handleDeleteAccount,
    addProperty,
    updateProperty,
    deleteProperty,
    updateBookingStatus
  } = useOwnerDashboard();

  // Check for user authentication and role
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth?type=owner');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.userType !== 'owner') {
      console.log('Invalid user type, redirecting to auth');
      navigate('/auth?type=owner');
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

  // Custom logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Check if profile is complete
  const isProfileComplete = userData 
    ? Boolean(userData.name && userData.phone && userData.address)
    : false;

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

  return (
    <OwnerDashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userData={userData}
      setUserData={setUserData}
      isProfileComplete={isProfileComplete}
      handleLogout={handleLogout}
      handleDeleteAccount={handleDeleteAccount}
    >
      {activeTab === 'dashboard' && (
        <OwnerDashboardTab 
          properties={properties} 
          bookings={bookings} 
          userData={userData} 
        />
      )}
      {activeTab === 'properties' && (
        <OwnerPropertiesTab 
          properties={properties}
          addProperty={addProperty}
          updateProperty={updateProperty}
          deleteProperty={deleteProperty}
        />
      )}
      {activeTab === 'bookings' && (
        <OwnerBookingsTab 
          bookings={bookings}
          properties={properties}
          updateBookingStatus={updateBookingStatus}
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
    </OwnerDashboardLayout>
  );
};

export default OwnerDashboard;

