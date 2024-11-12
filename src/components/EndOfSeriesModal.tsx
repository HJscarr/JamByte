'use client'

import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface EndOfSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EndOfSeriesModal: React.FC<EndOfSeriesModalProps> = ({ isOpen, onClose }) => {
  const { width, height } = useWindowSize();
  const [numberOfPieces, setNumberOfPieces] = useState(400);

  useEffect(() => {
    console.log('Effect: isOpen', isOpen); // Debug: Check if effect runs on isOpen change
    if (isOpen) {
      setNumberOfPieces(400);
      const interval = setInterval(() => {
        setNumberOfPieces((prev) => {
          const newValue = Math.max(prev - 40, 0); // Ensure never goes below 0
          console.log('New number of pieces:', newValue); // Debug: Check the decrement
          return newValue;
        });
      }, 300); // Adjust timing as needed

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 3000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
    // Adding setNumberOfPieces to the dependency array could cause unexpected behavior, so be cautious.
  }, [isOpen, width, height]); // Ensure useEffect is called when isOpen changes
  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Confetti width={width} height={height} numberOfPieces={numberOfPieces} />
        <div className="bg-white p-6 rounded-lg shadow-lg z-10">
          <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
          <p className="mb-4">You've reached the end of the series. We hope you had fun!</p>
          <button
            onClick={() => {
              onClose();
              setNumberOfPieces(0); // Optionally reset confetti immediately on close
            }}
            className="py-2 px-4 border border-transparent bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default EndOfSeriesModal;
