import React, { useState, useEffect } from 'react';
import { Settings2, Trash2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/accommodation';
import { updateProfile, getUserId } from '@/lib/sharedDataStore';

interface ProfileContentProps {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  handleLogout: () => void;
  handleDeleteAccount: () => void;
}

const ProfileContent = ({ 
  userData, 
  setUserData,
  handleLogout,
  handleDeleteAccount
}: ProfileContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhone(userData.phone || '');
      setAddress(userData.address || '');
      setDob(userData.dob || '');
    }
  }, [userData]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    
    const updatedUserData = {
      ...userData,
      name,
      phone,
      address,
      dob
    };
    
    try {
      // Get userId from token
      const token = localStorage.getItem('token');
      let userId = '';
      
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length >= 2) {
            const payload = JSON.parse(atob(tokenParts[1]));
            userId = payload.userId || '';
            console.log('Using userId for profile update:', userId);
          }
        } catch (err) {
          console.error('Failed to decode token:', err);
        }
      }
      
      if (!userId) {
        console.error('Could not find userId in token');
        throw new Error('User ID not found in token');
      }
      
      // Format data for the API based on the Profile model
      const profileData = {
        userId: userId, // Explicitly include userId
        phoneNumber: phone,
        bio: '',
        address: {
          street: address,
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      };
      
      console.log('Sending profile data with explicit userId:', profileData);
      
      // Save to backend database
      await updateProfile(profileData);
      
      // Update localStorage after successful API call
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved to database.",
      });
    } catch (error) {
      console.error('Failed to update profile in database:', error);
      
      // Still update localStorage even if the API call fails
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      setIsEditing(false);
      
      toast({
        title: "Profile update notice",
        description: "Profile saved locally. Database update will be retried later.",
        variant: "destructive",
      });
    }
  };

  if (!userData) return null;
  
  return (
    <div className="space-y-6 px-2 sm:px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold font-founders mb-2">Your Profile</h2>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32 rounded-full glassmorphic dark:glassmorphic-dark border border-white/20 flex items-center justify-center overflow-hidden">
          <div className="text-4xl">{name ? name[0]?.toUpperCase() || '?' : '?'}</div>
        </div>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="h-10 rounded-xl bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
              className="h-10 rounded-xl bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              required
              className="h-10 rounded-xl bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Birth</label>
            <Input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="h-10 rounded-xl bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={userData.email}
              disabled
              className="h-10 rounded-xl bg-background/30 text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button type="submit" className="flex-1 rounded-xl">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1 rounded-xl">
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 glassmorphic dark:glassmorphic-dark rounded-xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{name || 'Not set'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{userData.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{phone || 'Not set'}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{dob || 'Not set'}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{address || 'Not set'}</p>
            </div>
          </div>
          
          <Button onClick={() => setIsEditing(true)} className="w-full rounded-xl mt-4">
            Edit Profile
          </Button>
        </div>
      )}
      
      <div className="pt-4 space-y-3">
        <Button variant="outline" className="w-full rounded-xl">
          <Settings2 size={18} className="mr-2" />
          Update Password
        </Button>
        
        <Button variant="destructive" className="w-full rounded-xl" onClick={handleDeleteAccount}>
          <Trash2 size={18} className="mr-2" />
          Delete Account
        </Button>
        
        <Button variant="outline" className="w-full rounded-xl" onClick={handleLogout}>
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileContent;
