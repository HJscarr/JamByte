'use client';

import React, { useCallback, useState } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { CVProgressSteps } from '@/components/CVProgressSteps';
import { CVLoadingMessages } from '@/components/CVLoadingMessages';
import { CVAnalysisDownloader } from '@/components/CVAnalysisDownloader';

export default function CVHelperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const CHUNK_SIZE = 24000; // Safely under the 32KB limit

const connectWebSocket = (file: File) => {
  return new Promise<WebSocket>((resolve, reject) => {
    const websocket = new WebSocket("wss://peky0yjg20.execute-api.eu-west-1.amazonaws.com/production/");
    let connectionTimeout: NodeJS.Timeout;

    const cleanup = () => {
      clearTimeout(connectionTimeout);
      setWsConnected(false);
      setWs(null);
    };

    websocket.onopen = () => {
      console.log('WebSocket Connected');
      setWsConnected(true);
      setWs(websocket);
      clearTimeout(connectionTimeout);
      resolve(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);
        
        switch (data.type) {
          case 'start':
            setLoading(true);
            setAnalysis(prev => [...prev, data.message]);
            break;
          case 'complete':
            setLoading(false);
            setAnalysis(prev => [...prev, data.content]);
            websocket.close(1000, 'Analysis complete');
            break;
          case 'error':
            setError(data.message);
            setLoading(false);
            websocket.close(1000, 'Analysis error');
            break;
          case 'chunk_received':
            // Handle chunk acknowledgment if needed
            break;
        }
      } catch (err) {
        console.error('Error processing message:', err);
        setError('Error processing server message');
        websocket.close(1000, 'Message processing error');
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Please try again.');
      cleanup();
      reject(error);
    };

    websocket.onclose = (event) => {
      console.log('WebSocket Disconnected', event.code, event.reason);
      cleanup();
    };

    // Set a connection timeout
    connectionTimeout = setTimeout(() => {
      websocket.close(1000, 'Connection timeout');
      reject(new Error('WebSocket connection timeout'));
    }, 5000);
  });
};

const sendFileInChunks = async (websocket: WebSocket, file: File) => {
  const reader = new FileReader();
  
  reader.onload = async () => {
    try {
      const content = reader.result as string;
      const base64Content = btoa(
        encodeURIComponent(content).replace(
          /%([0-9A-F]{2})/g,
          (_, p1) => String.fromCharCode(parseInt(p1, 16))
        )
      );
      
      // Split the base64 content into chunks
      const chunks = [];
      for (let i = 0; i < base64Content.length; i += CHUNK_SIZE) {
        chunks.push(base64Content.slice(i, i + CHUNK_SIZE));
      }
      
      // Send initial metadata
      const initMessage = {
        action: "init_upload",
        filename: file.name,
        totalChunks: chunks.length,
        fileSize: base64Content.length
      };
      websocket.send(JSON.stringify(initMessage));
      
      // Send chunks with small delay to prevent overwhelming the connection
      for (let i = 0; i < chunks.length; i++) {
        const chunkMessage = {
          action: "upload_chunk",
          chunkIndex: i,
          totalChunks: chunks.length,
          content: chunks[i],
          filename: file.name
        };
        
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay between chunks
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.send(JSON.stringify(chunkMessage));
        } else {
          throw new Error('WebSocket connection closed while sending chunks');
        }
      }
      
      // Send completion message
      const completeMessage = {
        action: "complete_upload",
        filename: file.name
      };
      websocket.send(JSON.stringify(completeMessage));
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to process file. Please try again.');
      websocket.close(1000, 'Upload error');
    }
  };

  reader.readAsText(file);
};

// Update your handleFileUpload function
const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  if (!allowedTypes.includes(selectedFile.type)) {
    setError('Please upload a PDF, DOC, DOCX, or TXT file');
    return;
  }

  if (selectedFile.size > 10 * 1024 * 1024) {
    setError('File size should be less than 10MB');
    return;
  }

  try {
    setLoading(true);
    setAnalysis([]);
    setError(null);

    const websocket = await connectWebSocket(selectedFile);
    await sendFileInChunks(websocket, selectedFile);
    setFile(selectedFile);

  } catch (err) {
    console.error('Upload error:', err);
    setError(err instanceof Error ? err.message : 'Failed to process file. Please try again.');
    setLoading(false);
  }
}, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl pb-8">
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

          {analysis.length > 0 && (
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-left">
                <h3 className="text-xl font-semibold text-white mb-4">CV Analysis Results</h3>
                {loading ? (
                  <CVLoadingMessages />
                ) : (
                  <>
                    <p className="text-gray-300 mb-4">
                      Your CV has been analyzed against Amazon Leadership Principles and STAR format requirements.
                    </p>
                    <div className="prose prose-invert max-w-none">
                      {analysis.map((result, index) => (
                        <div key={index} className="mb-4 text-gray-300">
                          {result}
                        </div>
                      ))}
                    </div>
                    <div className="mt-10">
                      <CVAnalysisDownloader
                        analysisContent={analysis.join('\n\n')}
                      />
                    </div>
                    
                    <div className="flex flex-col items-center justify-center mt-8">
                      <a 
                        href="https://aws.amazon.com/machine-learning/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center hover:scale-110 transition-transform duration-300"
                      >
                        <img 
                          src="/aws-ml.png" 
                          alt="AWS Machine Learning"
                          className="h-16 w-auto opacity-70 transition-all duration-300 group-hover:opacity-100"
                        />
                        <span className="text-sm text-gray-400 mt-2 group-hover:text-gray-300">Powered by AWS ML</span>
                      </a>
                    </div>
                  </>
                )}
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