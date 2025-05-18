'use client'

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAiAssistant } from '../hooks/useAiAssistant';

interface ChatMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const chatbotRef = useRef<HTMLDivElement | null>(null);
  const { sendMessage, isLoading, error } = useAiAssistant();

  // Load chat history from sessionStorage when the component mounts
  useEffect(() => {
    console.log("Loading chat history from sessionStorage");
    const savedMessages = sessionStorage.getItem('chatHistory');
    if (savedMessages) {
      console.log("Saved messages found:", JSON.parse(savedMessages));
      setMessages(JSON.parse(savedMessages));
    } else {
      console.log("No saved messages found");
      setMessages([{ role: 'system', content: 'You are a helpful assistant.' }]);
    }
  }, []);

  // Save chat history to sessionStorage whenever messages change
  useEffect(() => {
    console.log("Saving chat history to sessionStorage:", messages);
    sessionStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustTextareaHeight(event.target);
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const adjustTextareaHeightToDefault = () => {
    const textArea = document.querySelector('.chatbot-textarea') as HTMLTextAreaElement | null;
    if (textArea) {
      textArea.style.height = '40px';
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    try {
      const response = await sendMessage(newMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't fetch the answer." }]);
    } finally {
      adjustTextareaHeightToDefault();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (input.trim()) {
        handleSubmit(event as unknown as React.FormEvent);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        console.log("Clicked outside of the chatbot!");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const preprocessContent = (content: string) => {
    return content.replace(/\n\n/g, '\n\n&nbsp;\n\n');
  };

  return (
    <div ref={chatbotRef} className="flex flex-col h-full w-full bg-gray-700 my-5 p-5 shadow-lg rounded-lg">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'assistant' ? 'text-left' : 'text-right'}`}>
            <span className={`inline-block py-1 px-3 rounded max-w-2xl ${msg.role === 'assistant' ? 'bg-secondary text-white text-left' : 'bg-gray-500 text-white text-left'}`}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {preprocessContent(msg.content)}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-end">
        <>
          <style>
            {`
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 4px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.6);
      }

      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5);
      }
    `}
          </style>

          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="chatbot-textarea flex-grow p-2 bg-transparent text-white placeholder-gray-400 border border-secondary rounded resize-none overflow-y-auto custom-scrollbar"
            placeholder="Send a message..."
            rows={1}
            style={{ minHeight: '50px', maxHeight: '200px', paddingTop: '10px', paddingBottom: '10px' }}
          ></textarea>
        </>
        <button
          type="submit"
          className={`px-4 h-10 text-white rounded-r-md h-[50px] ${isLoading ? 'bg-secondary' : 'bg-secondary hover:bg-pink-700'}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="ellipsis-dot">.</span>
              <span className="ellipsis-dot">.</span>
              <span className="ellipsis-dot">.</span>
            </>
          ) : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
