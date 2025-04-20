import type { Metadata } from "next";
import "./globals.css";
import Providers from '@/context/Providers';
import { Navbar } from '@/components/Navbar';
import AuthWrapper from '@/components/AuthWrapper';

export const metadata: Metadata = {
  title: "JamByte",
  description: "Technology projects to make your CV stand out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <AuthWrapper />
        </Providers>
      </body>
    </html>
  );
}