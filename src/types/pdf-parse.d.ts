declare module 'pdf-parse' {
  function pdfParse(dataBuffer: ArrayBuffer): Promise<{ text: string }>;
  export default pdfParse;
} 