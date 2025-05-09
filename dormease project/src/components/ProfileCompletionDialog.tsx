
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/accommodation';

interface ProfileCompletionDialogProps {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const ProfileCompletionDialog = ({ userData, setUserData }: ProfileCompletionDialogProps) => {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    
    const updatedUserData = {
      ...userData,
      name,
      phone,
      address,
      dob
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
    setOpen(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glassmorphic dark:glassmorphic-dark border border-white/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-founders">Complete Your Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
          
          <div className="pt-4">
            <Button type="submit" className="w-full rounded-xl h-11">
              Save Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionDialog;
