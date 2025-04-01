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

// Define types for PDF text content
interface PDFTextItem {
  str: string;
  transform?: number[];
  [key: string]: any;
}

interface PDFTextContent {
  items: PDFTextItem[];
  [key: string]: any;
}

export const useCV = (): UseCV => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [formattedCV, setFormattedCV] = useState<string | null>(null);

  /**
   * Convert PDF content to HTML
   */
  const convertPdfToHtml = (pageContent: PDFTextContent): string => {
    let html = '<div class="pdf-page">';
    
    // Sort items by their vertical position (top to bottom)
    const sortedItems = [...pageContent.items].sort((a, b) => {
      const aY = a.transform ? a.transform[5] : 0;
      const bY = b.transform ? b.transform[5] : 0;
      return bY - aY; // PDF coordinates are bottom-up
    });
    
    let currentY: number | null = null;
    let currentLine: PDFTextItem[] = [];
    
    // Group items by lines based on Y position
    sortedItems.forEach(item => {
      const y = item.transform ? item.transform[5] : 0;
      
      // If this is a new line
      if (currentY === null || Math.abs(y - currentY) > 2) {
        // Process the previous line if it exists
        if (currentLine.length > 0) {
          // Sort items in the line by X position (left to right)
          currentLine.sort((a, b) => {
            const aX = a.transform ? a.transform[4] : 0;
            const bX = b.transform ? b.transform[4] : 0;
            return aX - bX;
          });
          
          // Add the line to HTML
          html += '<p>' + currentLine.map(i => i.str).join(' ') + '</p>';
          currentLine = [];
        }
        
        currentY = y;
      }
      
      currentLine.push(item);
    });
    
    // Process the last line
    if (currentLine.length > 0) {
      currentLine.sort((a, b) => {
        const aX = a.transform ? a.transform[4] : 0;
        const bX = b.transform ? b.transform[4] : 0;
        return aX - bX;
      });
      
      html += '<p>' + currentLine.map(i => i.str).join(' ') + '</p>';
    }
    
    html += '</div>';
    return html;
  };

  /**
   * Extract text from an uploaded file based on its type
   */
  const extractText = async (file: File): Promise<{ text: string; html: string }> => {
    switch (file.type) {
      case 'application/pdf':
        try {
          if (typeof window === 'undefined') {
            throw new Error('PDF processing is only available in the browser');
          }
          
          const fileReader = new FileReader();
          const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
            fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
            fileReader.onerror = reject;
            fileReader.readAsArrayBuffer(file);
          });

          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdf.numPages;
          let extractedText = '';
          let extractedHtml = '';

          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const pageText = await page.getTextContent();
            const pageLines = pageText.items.map((item) => item.str).join('\n');
            
            // Convert page content to HTML
            const pageHtml = convertPdfToHtml(pageText);
            
            if (extractedText !== '') {
              extractedText += '\n\n';
            }
            extractedText += pageLines;

            extractedHtml += pageHtml;
          }

          return {
            text: extractedText.trim(),
            html: `<div class="pdf-document">${extractedHtml}</div>`
          };
        } catch (error) {
          console.error('PDF extraction error:', error);
          throw new Error('Failed to extract text from PDF. Please try a different file.');
        }
      
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        try {
          const arrayBuffer = await file.arrayBuffer();
          const textResult = await mammoth.extractRawText({ arrayBuffer });
          const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
          return {
            text: textResult.value,
            html: htmlResult.value
          };
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
      // Extract text and HTML from the file
      const { text, html } = await extractText(file);
      
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
          html_content: html,
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