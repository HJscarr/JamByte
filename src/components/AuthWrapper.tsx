'use client'

import React, { useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import UserAuth from './UserAuth';
import { createClient } from '@/utils/client';

// Define the UserAttributes type based on your UserContext
interface UserAttributes {
  username: string;
  userId: string;
  email: string;
  firstName: string;
  signInDetails: string;
  accessToken: string;
  idToken: string;
}

const AuthWrapper: React.FC = () => {
  const { setUser, modalState, setModalState } = useUser();
  const supabase = createClient();

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLoginModalChange = useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (value) => {
      setModalState(prev => ({
        ...prev,
        showLoginModal: typeof value === 'function' ? value(prev.showLoginModal) : value
      }));
    },
    [setModalState]
  );

  const handleSignUpModalChange = useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (value) => {
      setModalState(prev => ({
        ...prev,
        showSignUpModal: typeof value === 'function' ? value(prev.showSignUpModal) : value
      }));
    },
    [setModalState]
  );

  return (
    <UserAuth
      showLoginModal={modalState.showLoginModal}
      setShowLoginModal={handleLoginModalChange}
      showSignUpModal={modalState.showSignUpModal}
      setShowSignUpModal={handleSignUpModalChange}
      checkUser={checkUser}
    />
  );
};

export default AuthWrapper;