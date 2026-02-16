import React from 'react';
import { DeliveryChalanDocument } from '../../types/delivery-chalan';
import ConfidenceBadge from './ConfidenceBadge';

interface HeaderSectionProps {
  document: DeliveryChalanDocument;
  onUpdate: (updates: Partial<DeliveryChalanDocument>) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ document, onUpdate }) => {
  const formatModelName = (name: string) => {
    if (name.includes('gemini-3-pro')) return '3.0 Pro';
    if (name.includes('gemini-3-flash')) return '3.0 Flash';
    if (name.includes('gemini-2.5')) return '2.5 Flash';
    return name.replace('gemini-', '').replace('-preview', '').replace('-latest', '');
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide rounded border border-blue-200">
            📦 Delivery Chalan
          </span>
          <span className="text-xs text-slate-400">
            Processed by {formatModelName(document.processing_model)}
          </span>
        </div>
        <ConfidenceBadge confidence={document.ai_confidence} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">CHALAN NO / চালান নং</label>
          <input
            type="text"
            className="w-full text-base font-semibold text-slate-900 border-b-2 border-slate-200 focus:border-blue-500 focus:outline-none py-1 transition-colors bangla-text"
            value={document.chalan_number || ''}
            onChange={(e) => onUpdate({ chalan_number: e.target.value })}
            placeholder="No chalan no."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">PO NO / পি.ও. নং</label>
          <input
            type="text"
            className="w-full text-base font-medium text-slate-900 border-b-2 border-slate-200 focus:border-blue-500 focus:outline-none py-1 transition-colors bangla-text"
            value={document.po_number || ''}
            onChange={(e) => onUpdate({ po_number: e.target.value })}
            placeholder="No PO no."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">DATE / তারিখ</label>
          <input
            type="text"
            className="w-full text-base font-medium text-slate-900 border-b-2 border-slate-200 focus:border-blue-500 focus:outline-none py-1 transition-colors bangla-text"
            value={document.date || ''}
            onChange={(e) => onUpdate({ date: e.target.value })}
            placeholder="DD/MM/YYYY"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;