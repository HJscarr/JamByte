import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';

interface ChatMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
}

interface ApiResponse {
  analysis: string;
}

interface ErrorResponse {
  error: string;
}

export const useAiAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: ChatMessage[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the current session and JWT token
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) {
        throw new Error('No authentication token available');
      }

      // Convert messages to a single text content
      const textContent = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const response = await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/ai-assistant', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text_content: textContent }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data: ApiResponse = await response.json();
      return { content: data.analysis };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
  };
}; 