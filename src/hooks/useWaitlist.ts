import { useState } from 'react';

interface UseWaitlistProps {
  waitlistFeature: string;
}

export const useWaitlist = ({ waitlistFeature }: UseWaitlistProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/register-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'waitlist-feature': waitlistFeature.toLowerCase(),
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    email,
    setEmail,
    isSubmitted,
    error,
    handleSubmit,
  };
}; 