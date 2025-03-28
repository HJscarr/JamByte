import { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
        // Load PDF document
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Combine text items from the page
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          text += pageText + '\n\n';
        }
        return text;
      
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        // Convert Word to text using mammoth
        const wordArrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: wordArrayBuffer });
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