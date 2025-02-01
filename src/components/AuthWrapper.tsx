'use client'

import React, { useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import UserAuth from './UserAuth';
import { useAuth } from '@/context/AuthContext';

// Define the UserAttributes type based on your Cognito user attributes
interface UserAttributes {
  username: string;
  sub: string;
  email: string;
  given_name: string;
  'custom:signInDetails'?: string;
  access_token: string;
  id_token: string;
}

const AuthWrapper: React.FC = () => {
  const { setUser, modalState, setModalState } = useUser();
  const auth = useAuth();

  const checkUser = async () => {
    try {
      if (auth.isAuthenticated && auth.user) {
        const cognitoUser = {
          id: auth.user.profile.sub,
          email: auth.user.profile.email,
          user_metadata: {
            first_name: auth.user.profile.given_name,
          }
        };
        setUser(cognitoUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    // Listen for auth state changes
    if (auth.isLoading) return;
    
    checkUser();
  }, [auth.isAuthenticated, auth.user, auth.isLoading]);

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