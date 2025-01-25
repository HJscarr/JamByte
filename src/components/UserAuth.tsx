'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import { createClient } from '@/utils/client';

interface AuthComponentProps {
  checkUser: () => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSignUpModal: boolean;
  setShowSignUpModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserAuth: React.FC<AuthComponentProps> = ({
  checkUser,
  showLoginModal, setShowLoginModal,
  showSignUpModal, setShowSignUpModal
}) => {
  // Sign-in state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign-up state
  const [signUpFirstname, setSignUpFirstname] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // Password reset state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSignInError(null);
      setShowLoginModal(false);
      checkUser();
    } catch (error: any) {
      console.error("Error signing in", error);
      setSignInError(error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            first_name: signUpFirstname,
            last_name: signUpLastName,
          },
        },
      });

      if (error) throw error;

      setSignUpError(null);
      setShowSignUpModal(false);
      alert('Please check your email for the confirmation link.');
    } catch (error: any) {
      console.error("Error signing up", error);
      setSignUpError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setForgotPasswordError(null);
      setShowForgotPasswordModal(false);
      alert('Please check your email for the password reset link.');
    } catch (error: any) {
      console.error('Error sending password reset email', error);
      setForgotPasswordError(error.message);
    }
  };

  return (
    <div className="relative z-50">
      {/* Sign In Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
            />
            <button
              onClick={handleSignIn}
              className="w-full bg-secondary text-white rounded-md py-2 px-4 hover:bg-pink-700 mb-4"
            >
              Sign In
            </button>
            <div className="flex justify-between text-sm">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignUpModal(true);
                }}
                className="text-secondary hover:text-pink-700"
              >
                Create an account
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowForgotPasswordModal(true);
                }}
                className="text-secondary hover:text-pink-700"
              >
                Forgot password?
              </button>
            </div>
            {signInError && (
              <div className="text-red-600 p-2 rounded-md bg-red-100 mt-2">
                {signInError}
              </div>
            )}
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
            <h2 className="text-2xl font-bold mb-4">Create Account</h2>
            <input
              type="text"
              placeholder="First Name"
              value={signUpFirstname}
              onChange={(e) => setSignUpFirstname(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={signUpLastName}
              onChange={(e) => setSignUpLastName(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
            />
            <button
              onClick={handleSignUp}
              className="w-full bg-secondary text-white rounded-md py-2 px-4 hover:bg-pink-700 mb-4"
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setShowSignUpModal(false);
                setShowLoginModal(true);
              }}
              className="text-sm text-secondary hover:text-pink-700"
            >
              Already have an account? Sign in
            </button>
            {signUpError && (
              <div className="text-red-600 p-2 rounded-md bg-red-100 mt-2">
                {signUpError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full">
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
            />
            <button
              onClick={handleForgotPassword}
              className="w-full bg-secondary text-white rounded-md py-2 px-4 hover:bg-pink-700 mb-4"
            >
              Send Reset Link
            </button>
            {forgotPasswordError && (
              <div className="text-red-600 p-2 rounded-md bg-red-100 mt-2">
                {forgotPasswordError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAuth;