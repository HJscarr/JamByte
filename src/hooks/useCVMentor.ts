import { useState } from 'react';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

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

  /**
   * Extract text from an uploaded file based on its type
   */
  const extractText = async (file: File): Promise<string> => {
    switch (file.type) {
      case 'application/pdf':
        try {
          // Simple PDF text extraction without worker configuration
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          
          // Process each page
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Extract and join text strings with space
            const pageText = textContent.items
              .filter(item => 'str' in item)
              .map(item => (item as any).str)
              .join(' ');
            
            fullText += pageText + '\n\n';
          }
          
          return fullText.trim();
        } catch (error) {
          console.error('PDF extraction error:', error);
          throw new Error('Failed to extract text from PDF. Please try a different file.');
        }
      
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        try {
          // Word document extraction using mammoth
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          return result.value;
        } catch (error) {
          console.error('Word extraction error:', error);
          throw new Error('Failed to extract text from Word document. Please try a different file.');
        }
      
      default:
        throw new Error('Unsupported file type');
    }
  };

  /**
   * Process an uploaded CV file
   */
  const processCV = async (file: File) => {
    // Reset states
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setFormattedCV(null);

    // File size validation
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      setLoading(false);
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
      setLoading(false);
      return;
    }

    try {
      // Extract text from the file
      const text = await extractText(file);
      
      if (!text || text.trim().length === 0) {
        throw new Error('Could not extract any text from the file. It may be empty or corrupted.');
      }
      
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