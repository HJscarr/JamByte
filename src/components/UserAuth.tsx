'use client'

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface AuthComponentProps {
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showSignUpModal: boolean;
  setShowSignUpModal: (show: boolean) => void;
  title?: string;
}

const UserAuth: React.FC<AuthComponentProps> = ({
  showLoginModal, setShowLoginModal,
  showSignUpModal, setShowSignUpModal,
  title = 'Sign In'
}) => {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.signIn(email, password);
      setShowLoginModal(false);
      setError(null);
    } catch (error: any) {
      console.error("Error signing in", error);
      setError(error.message);
    }
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await auth.signUp(email, password, {
        given_name: firstName,
        family_name: lastName,
        email: email
      });
      setShowSignUpModal(false);
      setShowVerificationModal(true);
      setError(null);
    } catch (error: any) {
      console.error("Error signing up", error);
      setError(error.message);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.confirmSignUp(email, verificationCode);
      setShowVerificationModal(false);
      setShowLoginModal(true);
      alert('Account verified successfully! Please sign in.');
    } catch (error: any) {
      console.error("Error verifying account", error);
      setError(error.message);
    }
  };

  const switchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const handleForgotPassword = async () => {
    try {
      const cognitoDomain = "https://your-cognito-domain.auth.eu-west-1.amazoncognito.com";
      const clientId = "18506g2uv82srnppeqn6bm673d";
      const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
      window.location.href = `${cognitoDomain}/forgotPassword?client_id=${clientId}&redirect_uri=${redirectUri}`;
    } catch (error: any) {
      console.error('Error with password reset', error);
    }
  };

  return (
    <div className="relative z-50">
      {/* Sign In Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full md:max-w-md">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16">
                <Image
                  src="/img/jambyte_logo.webp"
                  alt="JamByte Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="mx-auto max-w-xs">
              <h2 className="text-2xl font-bold mb-4 text-center break-words">{title}</h2>
            </div>
            <form onSubmit={handleSignIn}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button type="submit" className="w-full bg-secondary text-white rounded-md py-2 px-4 hover:bg-pink-700">
                Sign In
              </button>
            </form>
            <div className="flex justify-between text-sm mt-4">
              <button
                onClick={switchToSignUp}
                className="text-secondary hover:text-pink-700"
              >
                Create an account
              </button>
              <button
                onClick={handleForgotPassword}
                className="text-secondary hover:text-pink-700"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full">
            <button
              onClick={() => setShowSignUpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16">
                <Image
                  src="/img/jambyte_logo.webp"
                  alt="JamByte Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
            <form onSubmit={handleSignUp}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button type="submit" className="w-full bg-secondary text-white rounded-md py-2 px-4 hover:bg-pink-700">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16">
                <Image
                  src="/img/jambyte_logo.webp"
                  alt="JamByte Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Account</h2>
            <p className="mb-4 text-center">Please enter the verification code sent to your email.</p>
            <form onSubmit={handleVerification}>
              <input
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button type="submit" className="w-full bg-secondary text-white rounded-md py-2 px-4 hover:bg-pink-700">
                Verify Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAuth;