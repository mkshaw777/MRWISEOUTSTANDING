import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ReportView from './components/ReportView';
import { extractReportFromPDF } from './services/geminiService';
import { ReportData } from './types';
import { PieChart, ListChecks } from 'lucide-react';

const MAX_FILE_SIZE_MB = 4;

const App: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    // Check file size to prevent XHR/Proxy errors
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB to ensure reliable processing.`);
      setIsProcessing(false);
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(',')[1];

        try {
          const extractedData = await extractReportFromPDF(base64Content);
          setData(extractedData);
        } catch (err: any) {
          console.error(err);
          let errorMessage = "Failed to extract data.";
          
          if (err.message && (err.message.includes("JSON") || err.message.includes("Unterminated"))) {
            errorMessage = "Extraction failed. The report might be too large for a single pass. Please try splitting the PDF into smaller sections.";
          } else if (err.message) {
             errorMessage = err.message;
          }
          
          setError(errorMessage);
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setError("Error reading the file.");
        setIsProcessing(false);
      };
      
    } catch (e) {
      setError("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ListChecks className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Pending Bill Analyzer</span>
            </div>
            {/* Optional: Add user profile or settings here */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start">
            <div className="flex-shrink-0 text-red-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {!data ? (
          <div className="max-w-xl mx-auto mt-12">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Simplify Your Collections
              </h1>
              <p className="mt-4 text-lg text-gray-500">
                Upload your weekly "MR-wise Pending" PDF report. <br className="hidden sm:inline"/>
                We'll extract the bills and generate WhatsApp-ready summaries instantly.
              </p>
            </div>
            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-center">
               <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 </div>
                 <h3 className="font-medium text-gray-900">PDF Extraction</h3>
                 <p className="text-sm text-gray-500 mt-1">Automatic parsing of complex tables.</p>
               </div>
               <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                 </div>
                 <h3 className="font-medium text-gray-900">WhatsApp Ready</h3>
                 <p className="text-sm text-gray-500 mt-1">One-click sharing with your team.</p>
               </div>
               <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                 <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <PieChart className="w-6 h-6 text-purple-600" />
                 </div>
                 <h3 className="font-medium text-gray-900">Clear Insights</h3>
                 <p className="text-sm text-gray-500 mt-1">Organized view of overdue bills.</p>
               </div>
            </div>
          </div>
        ) : (
          <ReportView data={data} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;