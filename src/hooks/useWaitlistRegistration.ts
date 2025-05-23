import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { captureEvent } from '@/lib/posthog';

export const useWaitlistRegistration = (courseName: string) => {
  const { user, setModalState } = useAuth();
  const [registered, setRegistered] = useState(false);

  const handleRegistration = () => {
    if (!user) {
      setModalState(prev => ({ 
        ...prev, 
        showSignUpModal: true,
        loginModalTitle: 'Sign In/Up to Join the Waitlist' 
      }));
    } else {
      setRegistered(true);
      // Track the waitlist registration in PostHog
      captureEvent('waitlist_registration', {
        course: courseName,
        userId: user.profile.sub,
        email: user.profile.email
      });
    }
  };

  return {
    registered,
    handleRegistration,
    user
  };
}; 