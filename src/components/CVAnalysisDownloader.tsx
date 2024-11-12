import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export function CVAnalysisDownloader({ analysisContent }: { analysisContent: string }) {
  const handleDownload = () => {
    const blob = new Blob([analysisContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cv-analysis.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleDownload}
        className="group relative inline-flex items-center px-8 py-3 text-lg font-medium text-white rounded-lg overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 transition-all duration-300 group-hover:opacity-80" />
        <div className="relative flex items-center space-x-2">
          <ArrowDownTrayIcon className="w-6 h-6" />
          <span>Download Analysis Report</span>
        </div>
        <div className="absolute inset-0 transform translate-x-full group-hover:-translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </div>
  );
}
