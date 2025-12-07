import React, { useState } from 'react';
import { MR } from '../types';
import StockistCard from './StockistCard';
import { ChevronDown, ChevronRight, Share2, Copy, Check } from 'lucide-react';

interface MRSectionProps {
  mr: MR;
  reportDate: string;
}

const MRSection: React.FC<MRSectionProps> = ({ mr, reportDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Function to format data for WhatsApp
  const generateWhatsAppText = () => {
    let text = `*Outstanding Report - ${mr.name}*\n`;
    text += `*As on:* ${reportDate}\n`;
    text += `*Total Outstanding:* ₹${mr.totalOutstanding.toLocaleString('en-IN')}\n\n`;

    mr.stockists.forEach((stockist) => {
      if (stockist.totalOutstanding > 0) {
        text += `*${stockist.name}*\n`;
        text += `Total: ₹${stockist.totalOutstanding.toLocaleString('en-IN')}\n`;
        
        // Add only pending bills to keep message concise
        stockist.bills.forEach(bill => {
            text += `📄 ${bill.invoiceNo} | Bal: ₹${bill.balance} | Due: ${bill.dueDate} | O/D: ${bill.overDueDays}\n`;
        });
        text += `\n`;
      }
    });

    return encodeURIComponent(text);
  };

  const copyToClipboard = () => {
    const text = decodeURIComponent(generateWhatsAppText());
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${generateWhatsAppText()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div 
        className="p-4 flex items-center justify-between bg-white cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md transition-colors ${isOpen ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
            {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{mr.name}</h3>
            <p className="text-sm text-gray-500">{mr.stockists.length} Stockists</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Pending</p>
          <p className="text-lg font-bold text-red-600">₹{mr.totalOutstanding.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className="flex justify-end gap-2 mb-4">
             <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Summary'}
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              Share on WhatsApp
            </button>
          </div>
          
          <div className="space-y-4">
            {mr.stockists.map((stockist, index) => (
              <StockistCard key={index} stockist={stockist} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MRSection;