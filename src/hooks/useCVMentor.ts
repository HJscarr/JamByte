import { useState, useEffect } from 'react';
import { PDFDocument, PDFPage } from 'pdf-lib';
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

  const convertToPDF = async (file: File): Promise<Blob> => {
    const arrayBuffer = await file.arrayBuffer();
    
    switch (file.type) {
      case 'application/pdf':
        return new Blob([arrayBuffer], { type: 'application/pdf' });
      
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;
        
        // Create a temporary div to parse HTML
        const div = document.createElement('div');
        div.innerHTML = html;
        
        // Create PDF
        const wordPdfDoc = await PDFDocument.create();
        let wordPage = wordPdfDoc.addPage();
        let currentY = wordPage.getSize().height - 50;
        
        // Process each paragraph
        const paragraphs = Array.from(div.getElementsByTagName('p'));
        for (const p of paragraphs) {
          if (currentY < 50) {
            wordPage = wordPdfDoc.addPage();
            currentY = wordPage.getSize().height - 50;
          }
          
          wordPage.drawText(p.textContent || '', {
            x: 50,
            y: currentY,
            size: 12,
          });
          currentY -= 14;
        }
        
        const wordPdfBytes = await wordPdfDoc.save();
        return new Blob([wordPdfBytes], { type: 'application/pdf' });
      
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

      // Convert file to PDF
      const pdfBlob = await convertToPDF(file);
      
      // Convert PDF to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result?.toString().split(',')[1];
          if (base64) resolve(base64);
          else reject(new Error('Failed to convert file to base64'));
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(pdfBlob);
      });

      const response = await fetch('https://qkibtbq1k5.execute-api.eu-west-1.amazonaws.com/cv-mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          file_content: base64Data,
          content_type: 'application/pdf' // Always send as PDF
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