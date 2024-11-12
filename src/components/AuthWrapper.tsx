'use client'

import React from 'react';
import { useUser } from '@/context/UserContext';
import UserAuth from './UserAuth';
import { getCurrentUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';

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

  const checkUser = async () => {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      const { tokens } = await fetchAuthSession();

      const userData: UserAttributes = {
        username,
        userId,
        email: userAttributes.email ?? '',
        firstName: userAttributes.given_name ?? '',
        signInDetails: JSON.stringify(signInDetails),
        accessToken: tokens?.accessToken?.toString() ?? '',
        idToken: tokens?.idToken?.toString() ?? ''
      };

      setUser({ attributes: userData });
      console.log("User authenticated and attributes fetched");
      console.log(`Username: ${username}`);
      console.log(`User ID: ${userId}`);
      console.log(`Sign-in details:`, signInDetails);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error checking user:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
      setUser(null);
    }
  };

  return (
    <UserAuth
      showLoginModal={modalState.showLoginModal}
      setShowLoginModal={() => setModalState(prev => ({ ...prev, showLoginModal: !prev.showLoginModal }))}
      showSignUpModal={modalState.showSignUpModal}
      setShowSignUpModal={() => setModalState(prev => ({ ...prev, showSignUpModal: !prev.showSignUpModal }))}
      checkUser={checkUser}
    />
  );
};

export default AuthWrapper;