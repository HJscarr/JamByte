import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import 'github-markdown-css';

interface MarkdownProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownProps> = ({ content }) => {
  const [sanitizedMarkup, setSanitizedMarkup] = useState('');

  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        // Convert markdown to HTML
        const rawMarkup = await marked(content);
        // Sanitize the output
        const sanitized = DOMPurify.sanitize(rawMarkup);
        setSanitizedMarkup(sanitized);
      } catch (error) {
        console.error('Error rendering markdown:', error);
        setSanitizedMarkup('Error rendering markdown');
      }
    };

    renderMarkdown();
  }, [content]);

  return (
    <div 
      className="markdown-body"
      style={{
        backgroundColor: '#1a202c',
        color: '#e2e8f0',            
        padding: '1rem',
        borderRadius: '0.5rem'
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedMarkup }} 
    />
  );
};

export default MarkdownRenderer;