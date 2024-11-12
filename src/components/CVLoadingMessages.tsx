'use client';

import { useState, useEffect } from 'react';

export function CVLoadingMessages() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  
  const messages = [
    "Analyzing your CV structure and format",
    "Evaluating against Amazon Leadership Principles",
    "Checking STAR format implementation",
    "Generating personalized recommendations"
  ];
  
  useEffect(() => {
    let currentCharIndex = 0;
    let messageTimer: ReturnType<typeof setTimeout>;
    let typingTimer: ReturnType<typeof setTimeout>;
    
    const typeMessage = () => {
      const currentMessage = messages[messageIndex];
      if (currentCharIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, currentCharIndex + 1));
        currentCharIndex++;
        typingTimer = setTimeout(typeMessage, 50);
      } else {
        messageTimer = setTimeout(() => {
          setDisplayedText('');
          currentCharIndex = 0;
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2000);
      }
    };
    
    typeMessage();
    
    return () => {
      clearTimeout(typingTimer);
      clearTimeout(messageTimer);
    };
  }, [messageIndex]);
  
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="text-gray-300 font-mono min-h-[24px]">
        {displayedText}
        <span className="animate-pulse">▌</span>
      </div>
    </div>
  );
}