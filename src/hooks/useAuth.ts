"use client";

import { useAuth as useAuthContext } from '@/context/AuthContext';

// Re-export the useAuth hook from context for convenience
export const useAuth = useAuthContext;

// Additional auth-related hooks can be added here
export function useRequireAuth() {
  const { user, isLoading } = useAuthContext();
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    requiresAuth: !user && !isLoading,
  };
}

export function useUserType() {
  const { user, updateUserType } = useAuthContext();
  
  return {
    userType: user?.userType,
    isCustomer: user?.userType === 'customer',
    isOwner: user?.userType === 'owner',
    updateUserType,
  };
}
