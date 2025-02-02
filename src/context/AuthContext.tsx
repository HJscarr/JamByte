'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { CognitoUser, CognitoUserPool, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

interface CognitoUserProfile {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
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
}

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
});

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthContextType['user']>(null);

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
              }
            });

            setIsAuthenticated(true);
            setUser({ profile });
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
      confirmSignUp 
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