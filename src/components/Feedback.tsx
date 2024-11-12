import { useState } from 'react';

type FeedbackProps = {
  currentVideoName: string;
  currentVideoNumber: string; // Adding the currentVideoNumber prop
};

export const Feedback = ({ currentVideoName, currentVideoNumber }: FeedbackProps) => {
  const [feedback, setFeedback] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);  // new state to determine success
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false); // New state for feedback loading


  const videoFeedback = async (videoName: any, number: any, feedback: any) => {
    setIsLoadingFeedback(true); // Set loading state when starting feedback submission
    let statusCode = 0;
    try {
      const response = await fetch('https://oglp2c7cki.execute-api.eu-west-1.amazonaws.com/default/videoFeedback', {
      mode: 'cors',
      method: 'PUT',
      body: JSON.stringify({
        videoName: videoName,
        Number: number,  // Including the Number in the request body
        feedback: feedback,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    statusCode = response.status;
      await response.json();
    } catch (err:any) {
      console.log(err.message);
    } finally {
      setIsLoadingFeedback(false);  // Ensure the loading state is reset no matter the outcome
    }

    if (statusCode === 200) {
      setIsSuccess(true);
      setStatusMessage('Feedback submitted successfully.');
      setFeedback('');
    } else {
      setIsSuccess(false);
      setStatusMessage('Failed to submit feedback. Please try again.');
    }
  };

  const handleFeedbackSubmit = () => {
    videoFeedback(currentVideoName, currentVideoNumber, feedback); // Pass the currentVideoNumber as an argument
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
          className={`absolute bottom-2 right-2 px-4 py-2 ${isLoadingFeedback ? 'bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500' : 'bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500'} text-white rounded`}
          disabled={isLoadingFeedback} // Disable button while loading
        >
          {isLoadingFeedback ? (
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