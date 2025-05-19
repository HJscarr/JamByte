import { useState } from 'react';
import { useVideoFeedback } from '../hooks/useVideoFeedback';
import { useAuth } from '@/context/AuthContext';

type FeedbackProps = {
  currentVideoName: string;
  currentVideoNumber: string;
};

export const Feedback = ({ currentVideoName, currentVideoNumber }: FeedbackProps) => {
  const [feedback, setFeedback] = useState('');
  const { user, isAuthenticated } = useAuth();
  const { submitVideoFeedback, isLoading, statusMessage, isSuccess } = useVideoFeedback();

  const handleFeedbackSubmit = async () => {
    if (!isAuthenticated || !user?.profile) {
      console.error('User not authenticated');
      return;
    }

    await submitVideoFeedback(
      currentVideoName,
      currentVideoNumber,
      feedback,
      user.profile.email,
      user.profile.given_name || '',
      user.profile.family_name || ''
    );
    
    if (isSuccess) {
      setFeedback(''); // Clear feedback only on success
    }
  };

  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          name="feedback"
          id="feedback"
          rows={5}
          maxLength={300}
          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
          placeholder="Add your feedback..."
        />
        <button 
          onClick={handleFeedbackSubmit} 
          className={`absolute bottom-2 right-2 px-4 py-2 ${isLoading ? 'bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500' : 'bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500'} text-white rounded`}
          disabled={isLoading || !isAuthenticated}
        >
          {isLoading ? (
            <>
              <span className="ellipsis-dot">.</span>
              <span className="ellipsis-dot">.</span>
              <span className="ellipsis-dot">.</span>
            </>
          ) : 'Submit Feedback'}
        </button>
      </div>
      {statusMessage && (
        <div className={`mt-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default Feedback;