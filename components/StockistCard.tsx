import React from 'react';
import { Stockist } from '../types';
import { Phone, Calendar, IndianRupee, FileText } from 'lucide-react';

interface StockistCardProps {
  stockist: Stockist;
}

const StockistCard: React.FC<StockistCardProps> = ({ stockist }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4 last:mb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {stockist.name}
          </h4>
          <div className="flex gap-4 text-xs text-gray-500 mt-1">
            {stockist.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> Ph: {stockist.phone}
              </span>
            )}
            {stockist.mobile && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> Mob: {stockist.mobile}
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 md:mt-0 text-right">
          <p className="text-sm text-gray-500">Total Outstanding</p>
          <p className="font-bold text-gray-900">₹{stockist.totalOutstanding.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-gray-100 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="py-2 px-2">Invoice</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2 text-right">Value</th>
              <th className="py-2 px-2 text-right">Balance</th>
              <th className="py-2 px-2">Due Date</th>
              <th className="py-2 px-2 text-center">O/D</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stockist.bills.map((bill, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-2 font-mono text-gray-700">{bill.invoiceNo}</td>
                <td className="py-2 px-2 text-gray-600">{bill.date}</td>
                <td className="py-2 px-2 text-right text-gray-600">{bill.billValue.toLocaleString('en-IN')}</td>
                <td className="py-2 px-2 text-right font-medium text-red-600">
                  {bill.balance.toLocaleString('en-IN')}
                </td>
                <td className="py-2 px-2 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {bill.dueDate}
                  </div>
                </td>
                <td className="py-2 px-2 text-center text-gray-600">{bill.overDueDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockistCard;
