import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isProcessing) return;
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'application/pdf') {
          onFileSelect(file);
        } else {
          alert('Please upload a PDF file.');
        }
      }
    },
    [onFileSelect, isProcessing]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ease-in-out
        ${isProcessing ? 'bg-gray-50 border-gray-300 cursor-not-allowed opacity-60' : 'bg-white border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'}
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${isProcessing ? 'bg-gray-200' : 'bg-indigo-100'}`}>
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          ) : (
            <Upload className="w-8 h-8 text-indigo-600" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isProcessing ? 'Analyzing Report...' : 'Upload Outstanding Report'}
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            {isProcessing
              ? 'Gemini AI is extracting bills, MRs, and stockist data. This may take a few seconds.'
              : 'Drag and drop your PDF here (Max 4MB), or click to browse.'}
          </p>
        </div>
        {!isProcessing && (
          <label className="relative">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleChange}
            />
            <span className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 cursor-pointer">
              Choose File (Max 4MB)
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default FileUpload;