declare module 'pdfjs-dist' {
  export const version: string;
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  
  interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  interface PDFPageProxy {
    getTextContent(options?: {
      normalizeWhitespace?: boolean;
      disableCombineTextItems?: boolean;
    }): Promise<{
      items: Array<{ str: string }>;
    }>;
  }

  interface GetDocumentParams {
    data: ArrayBuffer;
  }
  
  export function getDocument(params: GetDocumentParams): {
    promise: Promise<PDFDocumentProxy>;
  };
} 