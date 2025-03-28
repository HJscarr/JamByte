import { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import pdfToText from 'react-pdftotext';

interface CVAnalysisResponse {
  analysis?: string;
  formattedCV?: string;
}

interface UseCV {
  loading: boolean;
  error: string | null;
  analysis: string | null;
  formattedCV: string | null;
  processCV: (file: File) => Promise<void>;
}

export const useCV = (): UseCV => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [formattedCV, setFormattedCV] = useState<string | null>(null);

  const extractText = async (file: File): Promise<string> => {
    switch (file.type) {
      case 'application/pdf':
        // Extract text from PDF using react-pdftotext
        return await pdfToText(file);
      
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        // Convert Word to text using mammoth
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      
      default:
        throw new Error('Unsupported file type');
    }
  };

  const processCV = async (file: File) => {
    // File size validation
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    // File type validation
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAnalysis(null);
      setFormattedCV(null);

      // Extract text from the file
      const text = await extractText(file);
      
      // Send text to backend
      const response = await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/cv-mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          text_content: text,
          content_type: file.type
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data: CVAnalysisResponse = await response.json();
      setAnalysis(data.analysis || null);
      setFormattedCV(data.formattedCV || null);
    } catch (err) {
      console.error('CV processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    analysis,
    formattedCV,
    processCV
  };
}; 