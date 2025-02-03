'use client'

import React from 'react';
import UserAuth from './UserAuth';
import { useAuth } from '@/context/AuthContext';

const AuthWrapper = () => {
  const { modalState, setModalState } = useAuth();

  return (
    <UserAuth
      showLoginModal={modalState.showLoginModal}
      setShowLoginModal={(show: boolean) => setModalState(prev => ({ ...prev, showLoginModal: show }))}
      showSignUpModal={modalState.showSignUpModal}
      setShowSignUpModal={(show: boolean) => setModalState(prev => ({ ...prev, showSignUpModal: show }))}
    />
  );
};

export default AuthWrapper;