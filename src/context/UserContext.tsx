'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}

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

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [modalState, setModalState] = useState<ModalState>(defaultModalState);

  return (
    <UserContext.Provider value={{ user, setUser, modalState, setModalState }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easier consumption of the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
