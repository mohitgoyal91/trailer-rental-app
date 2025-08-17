"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AppleSignInButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export function AppleSignInButton({ onSuccess, className }: AppleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Apple Sign-In flow
      // In a real implementation, this would redirect to Apple's OAuth endpoint
      const appleClientId = process.env.APPLE_CLIENT_ID || 'your_apple_client_id';
      
      if (!appleClientId || appleClientId === 'your_apple_client_id') {
        // Mock Apple Sign-In for development
        await simulateAppleSignIn();
      } else {
        // Real Apple Sign-In implementation would go here
        // For now, we'll use the mock version
        await simulateAppleSignIn();
      }
      
      onSuccess?.();
      toast.success('Successfully signed in with Apple!');
    } catch (error) {
      console.error('Apple Sign-In error:', error);
      toast.error('Failed to sign in with Apple. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAppleSignIn = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user data that would come from Apple
    const mockUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      userType: 'customer' as const, // Default to customer, can be changed later
    };
    
    await signIn(mockUserData);
  };

  return (
    <Button
      onClick={handleAppleSignIn}
      disabled={isLoading}
      className={`w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 ${className}`}
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Signing in...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <AppleIcon />
          <span>Continue with Apple</span>
        </div>
      )}
    </Button>
  );
}

function AppleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}
