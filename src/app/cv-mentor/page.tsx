'use client';

import React, { useCallback, useState } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { CVProgressSteps } from '@/components/CVProgressSteps';
import { CVLoadingMessages } from '@/components/CVLoadingMessages';
import ReactMarkdown from 'react-markdown';

export default function CVHelperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [formattedCV, setFormattedCV] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFile(selectedFile);
      setAnalysis(null);
      setFormattedCV(null);

      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(',')[1];

        // Send to Lambda for direct analysis
        const response = await fetch('https://hjsxlvbu9j.execute-api.eu-west-1.amazonaws.com/prod/CV-Mentor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            filename: selectedFile.name,
            content_type: selectedFile.type,
            file_content: base64Data
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAnalysis(data.analysis);
        setFormattedCV(data.formattedCV);
        setLoading(false);
      };

      reader.onerror = () => {
        throw new Error('Failed to read file');
      };

      reader.readAsDataURL(selectedFile);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process file. Please try again.');
      setLoading(false);
    }
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl pb-2">
            Enhance Your CV with AI
          </h2>

          <CVProgressSteps />

          <div className="mt-10">
            <label 
              htmlFor="cv-upload" 
              className={`relative block w-full max-w-xl mx-auto rounded-lg border-2 border-dashed 
                ${loading ? 'border-gray-500 cursor-not-allowed' : 'border-gray-300 hover:border-gray-400'}
                p-12 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              <input
                id="cv-upload"
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={loading}
              />
              {file ? (
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              ) : (
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <span className="mt-2 block text-sm font-semibold text-gray-200">
                {loading ? 'Analyzing...' : file ? file.name : 'Upload your CV'}
              </span>
              <span className="mt-2 block text-sm text-gray-400">
                Accepts PDF, DOC, DOCX, or TXT files (Max size: 10MB)
              </span>
            </label>
          </div>

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