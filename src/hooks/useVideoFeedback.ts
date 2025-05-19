import { useState } from 'react';

interface VideoFeedbackResponse {
  success: boolean;
  message: string;
}

export const useVideoFeedback = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const submitVideoFeedback = async (
    videoName: string,
    videoNumber: string,
    feedback: string,
    userEmail: string,
    firstName: string,
    lastName: string
  ) => {
    setIsLoading(true);
    let statusCode = 0;

    try {
      // Combine video information with feedback
      const message = `Video Feedback:\nVideo Name: ${videoName}\nVideo Number: ${videoNumber}\n\nFeedback:\n${feedback}`;

      const response = await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email: userEmail,
          message: message,
        }),
      });

      statusCode = response.status;
      let data: VideoFeedbackResponse;
      
      try {
        data = await response.json();
      } catch (e) {
        // If JSON parsing fails, treat the response as a success message
        data = {
          success: true,
          message: 'Feedback submitted successfully.'
        };
      }

      if (statusCode === 200) {
        setIsSuccess(true);
        setStatusMessage('Feedback submitted successfully.');
        return true;
      } else {
        setIsSuccess(false);
        setStatusMessage(data.message || 'Failed to submit feedback. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setIsSuccess(false);
      setStatusMessage('Failed to submit feedback. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitVideoFeedback,
    isLoading,
    statusMessage,
    isSuccess,
  };
}; 