declare module '*.lottie' {
  const content: string;
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-player': any;
  }
} 