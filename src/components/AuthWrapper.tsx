'use client'

import React from 'react';
import UserAuth from './UserAuth';
import { useAuth } from '@/context/AuthContext';

interface AuthWrapperProps {
  title?: string;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ title }) => {
  const { modalState, setModalState } = useAuth();

  return (
    <UserAuth
      showLoginModal={modalState.showLoginModal}
      setShowLoginModal={(show: boolean) => setModalState(prev => ({ ...prev, showLoginModal: show, loginModalTitle: undefined }))}
      showSignUpModal={modalState.showSignUpModal}
      setShowSignUpModal={(show: boolean) => setModalState(prev => ({ ...prev, showSignUpModal: show }))}
      title={modalState.loginModalTitle || title}
    />
  );
};

export default AuthWrapper;