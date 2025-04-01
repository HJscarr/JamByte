import { useState } from 'react';
import mammoth from 'mammoth';

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
          // Convert PDF to base64
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result?.toString().split(',')[1];
              if (base64) resolve(base64);
              else reject(new Error('Failed to convert file to base64'));
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
          });

          return base64Data;
        } catch (error) {
          console.error('PDF conversion error:', error);
          throw new Error('Failed to convert PDF to base64. Please try a different file.');
        }
      
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        try {
          const arrayBuffer = await file.arrayBuffer();
          const textResult = await mammoth.extractRawText({ arrayBuffer });
          return textResult.value;
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
      const content = await extractText(file);
      
      // Send to backend
      const response = await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/cv-mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          text_content: content,
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