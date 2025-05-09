import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// API base URL - make sure this matches your backend URL
const API_URL = 'http://localhost:5000';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'landlord' | 'admin';
}

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [userType, setUserType] = useState<'student' | 'owner'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type') as 'student' | 'owner';
    if (type && (type === 'student' || type === 'owner')) {
      setUserType(type);
    }
  }, [location]);

  const validateEmail = (emailValue: string, type: 'student' | 'owner'): boolean => {
    if (!emailValue) {
      setEmailError("Email is required");
      return false;
    }

    if (type === 'student' && !emailValue.endsWith('@srmist.edu.in')) {
      setEmailError("Please use your SRM student email (@srmist.edu.in)");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = (passwordValue: string): boolean => {
    if (!passwordValue) {
      setPasswordError("Password is required");
      return false;
    }

    if (passwordValue.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email and password
    const isEmailValid = validateEmail(email, userType);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setIsLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      console.log(`Attempting to connect to: ${API_URL}${endpoint}`);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Standard mode - allows reading response
        body: JSON.stringify({
          email,
          password,
          ...(isSignUp && {
            firstName,
            lastName,
            role: userType === 'owner' ? 'landlord' : 'student'
          })
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.status === 0) {
        // No-cors mode doesn't allow reading the response body
        throw new Error('Server could not be reached or returned an invalid response. Check server logs.');
      }

      let data;
      try {
        const text = await response.text();
        console.log('Response text:', text);
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error('Error parsing response:', err);
        throw new Error('Invalid response from server. Check server logs.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store the token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Store user data with proper role mapping
      if (data.user) {
        const userRole = data.user.role || (userType === 'owner' ? 'landlord' : 'student');
        const userToStore = {
          ...data.user,
          userType: userRole === 'landlord' ? 'owner' : 'student',
          name: `${data.user.firstName} ${data.user.lastName}`,
        };
        
        console.log('Storing user data:', userToStore);
        localStorage.setItem('user', JSON.stringify(userToStore));

        // Navigate based on user role
        if (userRole === 'landlord' || userType === 'owner') {
          console.log('Navigating to owner dashboard');
          navigate('/owner-dashboard?tab=dashboard');
        } else if (userRole === 'student' || userType === 'student') {
          console.log('Navigating to student dashboard');
          navigate('/student-dashboard?tab=home');
        } else if (userRole === 'admin') {
          console.log('Navigating to admin dashboard');
          navigate('/admin-dashboard');
        }
      }

      toast({
        title: isSignUp ? "Account created" : "Logged in successfully",
        description: `Welcome to DormEase!`,
      });

    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isSignUp
                ? "Please fill in the details below to create your account"
                : "Please enter your details to sign in"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Enter your last name"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder={userType === "student" ? "yourname@srmist.edu.in" : "Enter your email"}
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter your password"
                  className={passwordError ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className={password !== confirmPassword ? "border-red-500" : ""}
                  />
                </div>
                {password !== confirmPassword && confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </div>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmailError("");
                  setPasswordError("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-primary font-semibold ml-1 hover:underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
