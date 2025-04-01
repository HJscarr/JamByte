declare module 'pdf2html' {
  const pdf2html: (arrayBuffer: ArrayBuffer) => Promise<string>;
  export = pdf2html;
} 