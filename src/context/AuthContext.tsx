"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'customer' | 'owner';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (userData: Omit<User, 'id'>) => Promise<void>;
  signOut: () => void;
  updateUserType: (userType: 'customer' | 'owner') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session in localStorage
    const savedUser = localStorage.getItem('trailer_rental_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('trailer_rental_user');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (userData: Omit<User, 'id'>) => {
    setIsLoading(true);
    try {
      // Simulate Apple Sign-In process
      const newUser: User = {
        id: `user_${Date.now()}`,
        ...userData,
      };
      
      setUser(newUser);
      localStorage.setItem('trailer_rental_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('trailer_rental_user');
  };

  const updateUserType = (userType: 'customer' | 'owner') => {
    if (user) {
      const updatedUser = { ...user, userType };
      setUser(updatedUser);
      localStorage.setItem('trailer_rental_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signOut,
    updateUserType,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
