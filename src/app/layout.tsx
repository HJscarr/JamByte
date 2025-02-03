'use client';

import type { Metadata } from "next";
import "./globals.css";
import Providers from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import AuthWrapper from '@/components/AuthWrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Providers>
            <Navbar />
            {children}
            <AuthWrapper />
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  );
}