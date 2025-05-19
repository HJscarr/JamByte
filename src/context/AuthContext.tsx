'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { CognitoUser, CognitoUserPool, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { identifyUser } from '@/lib/posthog';

interface CognitoUserProfile {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  phone?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    profile: CognitoUserProfile;
  } | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, attributes: Record<string, string>) => Promise<void>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}

type ModalState = {
  showLoginModal: boolean;
  showSignUpModal: boolean;
  showVerificationModal: boolean;
  showForgotPasswordModal: boolean;
  showResetPasswordModal: boolean;
  loginModalTitle?: string;
};

const defaultModalState: ModalState = {
  showLoginModal: false,
  showSignUpModal: false,
  showVerificationModal: false,
  showForgotPasswordModal: false,
  showResetPasswordModal: false,
  loginModalTitle: undefined,
};

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
});

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [modalState, setModalState] = useState<ModalState>(defaultModalState);

  useEffect(() => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err: any, session: any) => {
        if (err) {
          console.error('Error getting session:', err);
          setIsLoading(false);
          return;
        }
        
        if (session.isValid()) {
          currentUser.getUserAttributes((err, attributes) => {
            if (err) {
              console.error('Error getting user attributes:', err);
              setIsLoading(false);
              return;
            }

            const profile: CognitoUserProfile = {
              sub: '',
              email: '',
            };

            attributes?.forEach(attr => {
              switch (attr.getName()) {
                case 'sub':
                  profile.sub = attr.getValue();
                  break;
                case 'email':
                  profile.email = attr.getValue();
                  break;
                case 'given_name':
                  profile.given_name = attr.getValue();
                  break;
                case 'family_name':
                  profile.family_name = attr.getValue();
                  break;
                case 'custom:phone':
                  profile.phone = attr.getValue();
                  break;
              }
            });

            setUser({ profile });
            setIsAuthenticated(true);
          });
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err);
              return;
            }

            const profile: CognitoUserProfile = {
              sub: '',
              email: '',
            };

            attributes?.forEach(attr => {
              switch (attr.getName()) {
                case 'sub':
                  profile.sub = attr.getValue();
                  break;
                case 'email':
                  profile.email = attr.getValue();
                  break;
                case 'given_name':
                  profile.given_name = attr.getValue();
                  break;
                case 'family_name':
                  profile.family_name = attr.getValue();
                  break;
                case 'custom:phone':
                  profile.phone = attr.getValue();
                  break;
              }
            });

            setUser({ profile });
            setIsAuthenticated(true);
            
            // Identify user in PostHog
            identifyUser(profile.sub, {
              email: profile.email,
              firstName: profile.given_name,
              lastName: profile.family_name
            });
            
            resolve();
          });
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  }, []);

  const signUp = useCallback(async (email: string, password: string, attributes: Record<string, string>) => {
    return new Promise<void>((resolve, reject) => {
      const attributeList = Object.entries(attributes).map(
        ([key, value]) => new CognitoUserAttribute({ Name: key, Value: value })
      );

      userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }, []);

  const signOut = useCallback(async () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const confirmSignUp = useCallback(async (email: string, code: string) => {
    return new Promise<void>((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      user, 
      signIn, 
      signUp, 
      signOut,
      confirmSignUp,
      modalState,
      setModalState
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 