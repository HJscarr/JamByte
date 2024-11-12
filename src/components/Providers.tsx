'use client'

import React from 'react';
import { CookiesProvider } from '@/context/CookiesContext';
import { UserProvider } from '@/context/UserContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </CookiesProvider>
  );
}