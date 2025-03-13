import { useState, useEffect } from 'react';

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

  const processCV = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAnalysis(null);
      setFormattedCV(null);

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

      const response = await fetch('https://nx6u70hzeh.execute-api.eu-west-1.amazonaws.com/$default/cv-mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          file_content: base64Data,
          content_type: file.type
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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