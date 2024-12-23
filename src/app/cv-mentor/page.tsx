'use client';

import React, { useCallback, useState } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { CVProgressSteps } from '@/components/CVProgressSteps';
import { CVLoadingMessages } from '@/components/CVLoadingMessages';
import { CVAnalysisDownloader } from '@/components/CVAnalysisDownloader';
import ReactMarkdown from 'react-markdown';

export default function CVHelperPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    if (!event.data || event.data.trim() === '') {
      console.log('Received empty message, skipping processing');
      return;
    }

    try {
      console.log('Raw message received:', event.data);
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      
      switch (data.type) {
        case 'start':
          setLoading(true);
          setAnalysis(prev => [...prev, data.message]);
          break;
        case 'chunk_received':
          console.log(`Chunk ${data.chunkIndex} of ${data.totalChunks} received`);
          if (data.isComplete) {
            console.log('All chunks received, waiting for analysis...');
          }
          break;
        case 'complete':
          setLoading(false);
          setAnalysis(prev => [...prev, data.content]);
          break;
        case 'error':
          setError(data.message);
          setLoading(false);
          break;
        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (err) {
      console.error('Error processing message:', err);
      console.warn('Raw message received:', event.data);
    }
  }, [setLoading, setAnalysis, setError]);

  const connectWebSocket = useCallback((file: File) => {
    return new Promise<WebSocket>((resolve, reject) => {
      const websocket = new WebSocket("wss://peky0yjg20.execute-api.eu-west-1.amazonaws.com/production");
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

      websocket.onmessage = handleWebSocketMessage;

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

      connectionTimeout = setTimeout(() => {
        websocket.close(1000, 'Connection timeout');
        reject(new Error('WebSocket connection timeout'));
      }, 5000);
    });
  }, [handleWebSocketMessage, setWsConnected, setWs, setError]);

  const sendFileContent = async (websocket: WebSocket, file: File) => {
    const MAX_FRAME_SIZE = 24576; // 24KB
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const content = reader.result as string;
          const uploadId = Date.now().toString(36) + Math.random().toString(36).substr(2);
          const base64Content = btoa(encodeURIComponent(content).replace(
            /%([0-9A-F]{2})/g,
            (_, p1) => String.fromCharCode(parseInt(p1, 16))
          ));
          
          // Split content into chunks
          const chunks: string[] = [];
          for (let i = 0; i < base64Content.length; i += MAX_FRAME_SIZE) {
            chunks.push(base64Content.slice(i, i + MAX_FRAME_SIZE));
          }
          
          // Track chunk acknowledgments
          const chunkAcks = new Set<number>();
          
          // Create a promise for each chunk
          const chunkPromises = chunks.map((chunk, index) => {
            return new Promise<void>((resolveChunk, rejectChunk) => {
              let retries = 0;
              
              const sendChunk = async () => {
                try {
                  if (websocket.readyState !== WebSocket.OPEN) {
                    throw new Error('WebSocket connection closed');
                  }
                  
                  const chunkMessage = {
                    action: "generate",
                    type: "chunk",
                    uploadId,
                    chunkIndex: index,
                    totalChunks: chunks.length,
                    content: chunk,
                    isLastChunk: index === chunks.length - 1
                  };
                  
                  websocket.send(JSON.stringify(chunkMessage));
                  
                  // Wait for acknowledgment
                  const ackTimeout = setTimeout(() => {
                    if (!chunkAcks.has(index)) {
                      if (retries < MAX_RETRIES) {
                        retries++;
                        sendChunk();
                      } else {
                        rejectChunk(new Error(`Failed to get acknowledgment for chunk ${index}`));
                      }
                    }
                  }, 5000);
                  
                  // Handle acknowledgment
                  const handleAck = (event: MessageEvent) => {
                    try {
                      const data = JSON.parse(event.data);
                      if (data.type === 'chunk_received' && 
                          data.chunkIndex === index) {
                        clearTimeout(ackTimeout);
                        chunkAcks.add(index);
                        resolveChunk();
                      }
                    } catch (err) {
                      console.warn('Error parsing message:', err);
                    }
                  };
                  
                  websocket.addEventListener('message', handleAck);
                  
                } catch (error) {
                  rejectChunk(error);
                }
              };
              
              sendChunk();
            });
          });
          
          // Wait for all chunks to be acknowledged
          await Promise.all(chunkPromises);
          
          resolve(undefined);
          
        } catch (error) {
          console.error('Error:', error);
          reject('Failed to process file. Please try again.');
          websocket.close(1000, 'Upload error');
        }
      };
      
      reader.onerror = () => {
        reject('Failed to read file');
      };
      
      reader.readAsText(file);
    });
  };

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
      await sendFileContent(websocket, selectedFile);
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
                <div className="markdown-content">
                  {analysis.map((result, index) => (
                    <div key={index} className="mb-4">
                      <ReactMarkdown>{result}</ReactMarkdown>
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
                    <span className="text-sm text-gray-400 mt-2 group-hover:text-gray-300">
                      Powered by AWS ML
                    </span>
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