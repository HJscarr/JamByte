'use client'

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Notification from './Notification';

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
  const { modalState, setModalState } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'request' | 'confirm'>('request');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordCode, setForgotPasswordCode] = useState('');
  const [forgotPasswordNewPassword, setForgotPasswordNewPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);

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
    setFormError(null);
    // Simple validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (phone && !/^\d{10,11}$/.test(phone)) {
      setFormError('Phone number must be 10 or 11 digits.');
      return;
    }
    try {
      const attributes: Record<string, string> = {
        given_name: firstName,
        family_name: lastName,
        email: email
      };
      if (dateOfBirth) {
        attributes['custom:date_of_birth'] = dateOfBirth;
      }
      if (phone) {
        attributes['custom:phone'] = phone;
      }
      await auth.signUp(email, password, attributes);
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
      setNotification({
        message: 'Account verified successfully! Please sign in.',
        type: 'success'
      });
    } catch (error: any) {
      console.error("Error verifying account", error);
      setError(error.message);
      setNotification({
        message: error.message,
        type: 'error'
      });
    }
  };

  const switchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const handleForgotPassword = () => {
    setForgotPasswordStep('request');
    setForgotPasswordEmail(email); // prefill if user typed email
    setForgotPasswordCode('');
    setForgotPasswordNewPassword('');
    setForgotPasswordError(null);
    setForgotPasswordSuccess(null);
    setModalState(prev => ({ ...prev, showForgotPasswordModal: true }));
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError(null);
    setForgotPasswordSuccess(null);
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordError('Please enter your email.');
      return;
    }
    try {
      const { CognitoUserPool, CognitoUser } = await import('amazon-cognito-identity-js');
      const userPool = new CognitoUserPool({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
      });
      const cognitoUser = new CognitoUser({
        Username: forgotPasswordEmail,
        Pool: userPool
      });
      cognitoUser.forgotPassword({
        onSuccess: () => {
          setForgotPasswordStep('confirm');
          setForgotPasswordSuccess('A verification code has been sent to your email.');
        },
        onFailure: (err) => {
          setForgotPasswordError(err.message || 'Failed to send reset code.');
        }
      });
    } catch (err: any) {
      setForgotPasswordError(err.message || 'Failed to send reset code.');
    }
  };

  const handleForgotPasswordConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError(null);
    setForgotPasswordSuccess(null);
    if (!forgotPasswordCode.trim() || !forgotPasswordNewPassword.trim()) {
      setForgotPasswordError('Please enter the code and your new password.');
      return;
    }
    try {
      const { CognitoUserPool, CognitoUser } = await import('amazon-cognito-identity-js');
      const userPool = new CognitoUserPool({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
      });
      const cognitoUser = new CognitoUser({
        Username: forgotPasswordEmail,
        Pool: userPool
      });
      cognitoUser.confirmPassword(forgotPasswordCode, forgotPasswordNewPassword, {
        onSuccess: () => {
          setForgotPasswordSuccess('Password reset successful! You can now sign in.');
          setTimeout(() => {
            setModalState(prev => ({ ...prev, showForgotPasswordModal: false }));
          }, 2000);
        },
        onFailure: (err) => {
          setForgotPasswordError(err.message || 'Failed to reset password.');
        }
      });
    } catch (err: any) {
      setForgotPasswordError(err.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="relative z-50">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

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
              <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1 text-sm font-medium">
                    First Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1 text-sm font-medium">
                    Last Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Email <span className="text-pink-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Password <span className="text-pink-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Date of Birth <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:border-pink-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 text-sm font-medium">
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md text-gray-500 bg-white text-sm h-10">
                    +44
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    pattern="\d{10,11}"
                    maxLength={11}
                    placeholder="Phone Number"
                    className="w-full p-2 border border-gray-300 border-l-0 rounded-r-md h-10 focus:ring-pink-400 focus:border-pink-400"
                  />
                </div>
              </div>
              {formError && <p className="text-red-500 mb-4">{formError}</p>}
              <button type="submit" className="w-full bg-secondary text-white rounded-md py-2 px-4 hover:bg-pink-700">
                Sign Up
              </button>
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  className="text-secondary hover:text-pink-700 text-sm font-semibold"
                  onClick={() => {
                    setShowSignUpModal(false);
                    setShowLoginModal(true);
                  }}
                >
                  Return to Login
                </button>
              </div>
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

      {/* Forgot Password Modal */}
      {modalState.showForgotPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full">
            <button
              onClick={() => setModalState(prev => ({ ...prev, showForgotPasswordModal: false }))}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
            {forgotPasswordStep === 'request' && (
              <form onSubmit={handleForgotPasswordRequest}>
                <label className="block text-gray-700 mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={e => setForgotPasswordEmail(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="Enter your email"
                />
                {forgotPasswordError && <p className="text-red-500 mb-4">{forgotPasswordError}</p>}
                {forgotPasswordSuccess && <p className="text-green-600 mb-4">{forgotPasswordSuccess}</p>}
                <button type="submit" className="w-full bg-secondary text-white rounded-md py-2 px-4 hover:bg-pink-700">Send Reset Code</button>
              </form>
            )}
            {forgotPasswordStep === 'confirm' && (
              <form onSubmit={handleForgotPasswordConfirm}>
                <label className="block text-gray-700 mb-1 text-sm font-medium">Verification Code</label>
                <input
                  type="text"
                  value={forgotPasswordCode}
                  onChange={e => setForgotPasswordCode(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="Enter the code from your email"
                />
                <label className="block text-gray-700 mb-1 text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={forgotPasswordNewPassword}
                  onChange={e => setForgotPasswordNewPassword(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="Enter your new password"
                />
                {forgotPasswordError && <p className="text-red-500 mb-4">{forgotPasswordError}</p>}
                {forgotPasswordSuccess && <p className="text-green-600 mb-4">{forgotPasswordSuccess}</p>}
                <button type="submit" className="w-full bg-secondary text-white rounded-md py-2 px-4 hover:bg-pink-700">Reset Password</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAuth;