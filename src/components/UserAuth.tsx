'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { signIn, signUp, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword, updatePassword } from 'aws-amplify/auth';
import { useCookiesContext } from '../context/CookiesContext';
import { useUser } from '../context/UserContext';
// import { AmplifyUser } from '../data/user';

// Define a TypeScript interface for the props
interface AuthComponentProps {
  checkUser: () => Promise<void>;//Promise<{ attributes: { username: any; email: any; firstName: any; }; } | null>;
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

  // Sign-in modal & user information\
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign-up modal & user information
  // const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpFirstname, setSignUpFirstname] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetPasswordCode, setResetPasswordCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const [signInError, setSignInError] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpConfirmError, setSignUpConfirmError] = useState<string | null>(null);
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);
  const [forceChangePassword, setForceChangePassword] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleSignIn = async () => {
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setForceChangePassword(true);
      } else if (isSignedIn) {
        setSignInError(null);
        setShowLoginModal(false);
        checkUser();
      }
    } catch (error) {
      console.error("Error signing in", error);
      setSignInError("Invalid credentials, please check again.")
    }
  };

  const handleSignUp = async () => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: signUpEmail,
        password: signUpPassword,
        options: {
          userAttributes: {
            email: signUpEmail,
            given_name: signUpFirstname,
            family_name: signUpLastName,
            birthdate: dateOfBirth,
            phone_number: phone,
          },
          autoSignIn: true
        }
      });

      console.log(userId, nextStep);
      setSignUpError(null);
      setShowVerificationModal(true);
    } catch (e: any) {
      if (e.message.includes('User already exists')) {
        console.error('User already exists:', e.message);
        setSignUpError('User already exists, please log in directly!');
      } else {
        console.error('An unexpected error occurred:', e.message);
        setSignUpError('An error occurred during verification, please try again later');
      }
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      console.log('Confirming sign up...');
      const { isSignUpComplete } = await confirmSignUp({ username: signUpEmail, confirmationCode: verificationCode });
      console.log('Sign up confirmed');
      setSignUpConfirmError(null);

      if (isSignUpComplete) {
        console.log('Attempting sign in...');
        await signIn({ username: signUpEmail, password: signUpPassword });
        console.log('Sign in successful');

        checkUser();
        setShowVerificationModal(false);
        setShowSignUpModal(false);
      }
    } catch (e) {
      console.error('Error confirming sign-up', e);
      setSignUpConfirmError('Incorrect code, please try again.');
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: signUpEmail });
      console.log('Verification code resent successfully');
    } catch (error) {
      console.error('Error resending code', error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await resetPassword({ username: forgotPasswordEmail });
      setForgotPasswordError(null);
      setShowForgotPasswordModal(false);
      setShowResetPasswordModal(true);
    } catch (error) {
      console.error('Error sending forgot password email', error);
      setForgotPasswordError('Failed to send password reset email. Please try again.');
    }
  };

  const handleResetPasswordConfirmation = async () => {
    try {
      await confirmResetPassword({ username: forgotPasswordEmail, confirmationCode: resetPasswordCode, newPassword });
      setResetPasswordError(null);
      alert('Password has been reset successfully. You can now log in with the new password.');
      setShowResetPasswordModal(false);
    } catch (error) {
      console.error('Error during password reset confirmation', error);
      setResetPasswordError('Failed to reset password. Please make sure your code is correct and try again.');
    }
  };

  const handleCompleteNewPassword = async (newPassword: string) => {
    try {
      await updatePassword({ oldPassword: password, newPassword });
      console.log("Password updated successfully");
      setShowLoginModal(false);
      setForceChangePassword(false);
      checkUser();
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  // useEffect(() => {
  //   // This cleanup function runs when the component is unmounted
  //   return () => {
  //     setUser(null);
  //   };
  // }, []);
  

  useEffect(() => {
    console.log("Login Modal:", showLoginModal);
    console.log("Signup Modal:", showSignUpModal);
  }, [showLoginModal, showSignUpModal]);


  return (
    <div>
      {/* SignIn Modal */}
      {showLoginModal && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center p-6 sm:p-4 md:p-2 lg:p-0">
          <div className="bg-white p-8 rounded w-full max-w-xs sm:max-w-lg">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Image
                className="mx-auto h-16 w-auto"
                src="/img/jambyte_logo.webp"
                alt="CompanyLogo"
                width={64}
                height={64}
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSignIn(); }}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {signInError && (
                    <div className="text-red-600 p-2 rounded-md bg-red-100 mt-2">
                      {signInError}
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md mt-5 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="flex w-full justify-center rounded-md mt-5 bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>

                <div className="text-center">
                  <div className="mt-4">
                    Not a member? <span onClick={() => { setShowSignUpModal(true); setShowLoginModal(false) }} className="text-secondary hover:underline cursor-pointer">Sign up here!</span>
                  </div>
                  <div className="mt-2">
                    <span onClick={() => { setShowForgotPasswordModal(true) }} className="text-secondary hover:underline cursor-pointer">Forgot password?</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SignUp Modal */}
      {showSignUpModal && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center p-6 sm:p-4 md:p-2 lg:p-0">
          <div className="bg-white p-8 rounded  w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">

            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign up and start <span className="bg-gradient-to-r from-secondary to-red-400 inline-block text-transparent bg-clip-text">building</span> 🔧
            </h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSignUp(); }}>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {/* Username */}
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="signUpFirstname"
                        name="signUpFirstname"
                        type="text"
                        required
                        value={signUpFirstname}
                        onChange={e => setSignUpFirstname(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="signUpLastName" className="block text-sm font-medium leading-6 text-gray-900">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="signUpLastName"
                        name="signUpLastName"
                        type="text"
                        required
                        value={signUpLastName}
                        onChange={(e) => setSignUpLastName(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                </div>

                {/* Email */}
                <div>
                  <label htmlFor="signUpEmail" className="block text-sm font-medium leading-6 text-gray-900">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="signUpEmail"
                      name="signUpEmail"
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={e => setSignUpEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password<span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="signUpPassword"
                      name="signUpPassword"
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={e => setSignUpPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Date of Birth (Optional) */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium leading-6 text-gray-900">
                    Date of Birth
                  </label>
                  <div className="mt-2">
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Phone Number (Optional) */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      pattern="^\+\d{1,4}\d{10}$"
                      title="Please enter a phone number with country code followed by a 10-digit number."
                      placeholder="+441234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {signUpError && (
                    <div className="text-red-600 p-2 rounded-md bg-red-100 mt-2">
                      {signUpError}
                    </div>
                  )}
                </div>

                {/* Marketing Agreement Checkbox */}
                <div className="mt-4 flex items-center">
                  <input
                    id="marketingConsent"
                    name="marketingConsent"
                    type="checkbox"
                    checked={agreeToMarketing}
                    onChange={(e) => setAgreeToMarketing(e.target.checked)}
                    className="h-4 w-4 text-secondary focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="marketingConsent" className="ml-2 block text-sm text-gray-900">
                    I agree to receive marketing communications about JamByte.
                  </label>
                  {/* TODO: capture the tickbox response  */}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md mt-5 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Sign up
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSignUpModal(false)}
                    className="flex w-full justify-center rounded-md mt-5 bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showVerificationModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto backdrop-blur-md">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded p-5">
              <h2 className="text-xl mb-4">Verify Your Email</h2>
              <p>Enter the verification code sent to your email:</p>
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    className="flex-grow rounded-md"
                  />
                  <button
                    onClick={handleResendCode}
                    className="ml-2 text-secondary hover:underline text-sm"
                  >
                    Resend
                  </button>
                </div>
                {signUpConfirmError && (
                  <div className="text-red-600 p-2 rounded-md bg-red-100 mt-2">
                    {signUpConfirmError}
                  </div>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleConfirmSignUp}
                  className="flex w-full justify-center rounded-md mt-5 bg-secondary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="flex w-full justify-center rounded-md mt-5 bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center p-6 sm:p-4 md:p-2 lg:p-0">
          <div className="bg-white p-8 rounded w-full sm:max-w-lg">
            <h2 className="text-xl mb-5">Reset Your Password</h2>
            <p>Enter your email to receive a password reset link:</p>
            <input
              type="email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="block w-4/6 rounded-md border-0 py-1.5 mt-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {forgotPasswordError && (
              <div className="text-red-600 p-2 rounded-md bg-red-100 mt-2">
                {forgotPasswordError}
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={handleForgotPassword}
                className="mt-5 bg-secondary px-3 py-1.5 text-sm font-semibold leading-6 text-white rounded-md shadow-sm hover:bg-pink-700"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="mt-5 bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center p-6 sm:p-4 md:p-2 lg:p-0">
          <div className="bg-white p-8 rounded w-full sm:max-w-lg">
            <h2 className="text-xl mb-4">Set New Password</h2>
            <p>Enter the verification code sent to your email along with your new password:</p>

            <div className="mt-5">
              <label htmlFor="verificationCode" className="block text-sm font-medium leading-6 text-gray-900">
                Verification Code
              </label>
              <input
                id="verificationCode"
                type="text"
                value={resetPasswordCode}
                onChange={(e) => setResetPasswordCode(e.target.value)}
                className="block w-4/6 rounded-md border-0 py-1.5 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {resetPasswordError && (
              <div className="text-red-600 p-2 rounded-md bg-red-100 mt-2">
                {resetPasswordError}
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={handleResetPasswordConfirmation}
                className="mt-5 bg-secondary px-3 py-1.5 text-sm font-semibold leading-6 text-white rounded-md shadow-sm hover:bg-pink-700"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="mt-5 bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Force Change Password Modal */}
      {forceChangePassword && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center p-6 sm:p-4 md:p-2 lg:p-0">
          <div className="bg-white p-8 rounded w-full sm:max-w-lg border border-gray-300 shadow-lg">
            <h2 className="text-xl mb-5">Change Your Password</h2>
            <p>Please enter a new password:</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 mt-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleCompleteNewPassword(newPassword)}
                className="mt-5 bg-secondary px-3 py-1.5 text-sm font-semibold leading-6 text-white rounded-md shadow-sm hover:bg-pink-700"
              >
                Update Password
              </button>
              <button
                onClick={() => setForceChangePassword(false)}
                className="mt-5 bg-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
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
    </div>
  );
};

export default UserAuth;