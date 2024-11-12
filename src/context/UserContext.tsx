'use client'

import React, { createContext, useState, useContext, ReactNode, FunctionComponent } from 'react';
import { AmplifyUser } from '../data/user';

type UserContextType = {
  user: AmplifyUser | null;
  setUser: React.Dispatch<React.SetStateAction<AmplifyUser | null>>;
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
};

type ModalState = {
  showLoginModal: boolean;
  showSignUpModal: boolean;
  showVerificationModal: boolean;
  showForgotPasswordModal: boolean;
  showResetPasswordModal: boolean;
};

const defaultModalState: ModalState = {
  showLoginModal: false,
  showSignUpModal: false,
  showVerificationModal: false,
  showForgotPasswordModal: false,
  showResetPasswordModal: false,
};

// Creating a context with an undefined default value to enforce context provider usage
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FunctionComponent<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AmplifyUser | null>(null);
  const [modalState, setModalState] = useState<ModalState>(defaultModalState);

  const value = { user, setUser, modalState, setModalState };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for easier consumption of the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
