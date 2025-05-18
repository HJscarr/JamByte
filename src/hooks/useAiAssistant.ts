import { useState } from 'react';
import { CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';

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
      // Get Cognito session and token
      const userPool = new CognitoUserPool({
        UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
      });

      const cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) {
        throw new Error('User not authenticated');
      }

      const session = await new Promise<CognitoUserSession>((resolve, reject) => {
        cognitoUser.getSession((err: Error | null, session: CognitoUserSession) => {
          if (err) reject(err);
          else resolve(session);
        });
      });

      const token = session.getIdToken().getJwtToken();

      // Convert messages to a single text content
      const textContent = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const response = await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/ai-assistant', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Origin': window.location.origin,
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