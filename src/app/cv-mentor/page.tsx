'use client';

import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { CVProgressSteps } from '@/components/CVProgressSteps';
import { CVLoadingMessages } from '@/components/CVLoadingMessages';
import ReactMarkdown from 'react-markdown';
import { useCV } from '@/hooks/useCVMentor';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import cvMentorLoading from '@/images/lottie/cv-mentor-loading.json';

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function CVHelperPage() {
  const [file, setFile] = useState<File | null>(null);
  const { loading, error, analysis, formattedCV, processCV } = useCV();
  const { user, modalState, setModalState } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    await processCV(selectedFile);
  };

  const handleLoginClick = () => {
    setModalState(prev => ({ ...prev, showLoginModal: true }));
  };

  const showResults = analysis || formattedCV;

  return (
    <div className={`bg-gray-900 ${showResults ? 'min-h-screen' : 'min-h-screen'}`}>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 text-center sm:px-16 flex flex-col pb-4">
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl pt-6 pb-2">
            Enhance Your CV with AI
          </h2>

          {!showResults ? (
            <>
              <CVProgressSteps />

              <div className="flex-grow flex items-center justify-center mt-16 sm:mt-0 mb-2">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-4 -mt-16 md:-mt-20 sm:-mt-64">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 mb-2">
                      <Lottie
                        animationData={cvMentorLoading}
                        loop={true}
                        className="w-full h-full"
                        style={{ 
                          height: '100%', 
                          width: '100%',
                          transform: 'scale(1)'
                        }}
                      />
                    </div>
                    <div className="text-center mb-12">
                      <span className="text-sm md:text-base font-semibold text-gray-200 block">Analysing your CV...</span>
                      <span className="mt-1 block text-sm md:text-base text-gray-400">
                        This may take a minute or so
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {user ? (
                      <label 
                        htmlFor="cv-upload" 
                        className="relative block w-full max-w-xl mx-auto rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 p-8 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 -mt-16 md:mt-8 lg:mt-16 sm:-mt-64 mb-12"
                      >
                        <input
                          id="cv-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.docx"
                          onChange={handleFileUpload}
                        />
                        {file ? (
                          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                        ) : (
                          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <span className="mt-2 block text-sm font-semibold text-gray-200">
                          {file ? file.name : 'Upload your CV'}
                        </span>
                        <span className="mt-2 block text-sm text-gray-400">
                          Accepts PDF or DOCX files (Max size: 10MB)
                        </span>
                      </label>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 space-y-3 -mt-16 md:mt-8 lg:mt-16 sm:-mt-64 mb-12">
                        <p className="text-gray-300 text-lg">Sign In/Up below to analyse your CV! 📝</p>
                        <button
                          onClick={handleLoginClick}
                          className="relative text-gray-200 bg-gradient-to-r from-secondary to-red-400 hover:from-pink-500 hover:to-red-500 rounded flex items-center justify-center gap-2 md:px-14 md:py-3 px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-[120px] md:w-[140px]"
                        >
                          <span>Sign In/Up</span>
                          <UserCircleIcon className="h-3 w-3 md:h-5 md:w-5 flex-shrink-0 text-white" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex-grow pb-24">
              {analysis && (
                <div className="mt-8 max-w-4xl mx-auto">
                  <div className="bg-white bg-opacity-10 rounded-lg p-6 text-left">
                    <h3 className="text-xl font-semibold text-white mb-4">CV Analysis Results</h3>
                    <div className="markdown-content">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {formattedCV && (
                <div className="mt-8 max-w-4xl mx-auto">
                  <div className="bg-white bg-opacity-10 rounded-lg p-6 text-left">
                    <h3 className="text-xl font-semibold text-white mb-4">Formatted CV</h3>
                    <div className="markdown-content">
                      <ReactMarkdown>{formattedCV}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-4 text-red-400">{error}</p>
              )}
            </div>
          )}

          {/* Background gradient */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
            style={{
              maskImage: 'radial-gradient(closest-side,white,transparent)'
            }}
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}