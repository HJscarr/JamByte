'use client'

import React from 'react';
import { CookiesProvider } from '@/context/CookiesContext';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <AuthProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </AuthProvider>
    </CookiesProvider>
  );
}