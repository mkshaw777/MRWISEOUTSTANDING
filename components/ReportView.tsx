import React from 'react';
import { ReportData } from '../types';
import MRSection from './MRSection';
import { FileText, Calendar, IndianRupee } from 'lucide-react';

interface ReportViewProps {
  data: ReportData;
  onReset: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ data, onReset }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{data.agencyName}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <FileText className="w-4 h-4" />
                <span className="text-sm">Outstanding Statement</span>
                <span className="mx-2">•</span>
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{data.reportDate}</span>
              </div>
            </div>
            <div className="flex items-end flex-col">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Grand Total Pending</span>
              <span className="text-3xl font-extrabold text-indigo-900 flex items-center">
                <IndianRupee className="w-6 h-6 mr-1" />
                {data.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          
          <div className="h-px bg-gray-100 w-full mb-6"></div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              Found <strong className="text-gray-900">{data.mrs.length}</strong> Medical Representative groups.
            </p>
            <button 
              onClick={onReset}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Upload Another File
            </button>
          </div>
        </div>
      </div>

      {/* MR List */}
      <div className="space-y-4">
        {data.mrs.map((mr, index) => (
          <MRSection key={index} mr={mr} reportDate={data.reportDate} />
        ))}
      </div>
    </div>
  );
};

export default ReportView;
