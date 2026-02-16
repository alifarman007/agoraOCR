import React from 'react';
import { DeliveryChalanDocument, SummaryField } from '../../types/delivery-chalan';
import ConfidenceBadge from './ConfidenceBadge';
import { Plus, Trash2 } from 'lucide-react';

interface SummarySectionProps {
  document: DeliveryChalanDocument;
  onUpdate: (updates: Partial<DeliveryChalanDocument>) => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ document, onUpdate }) => {
  
  const updateSummaryField = (id: string, field: keyof SummaryField, value: any) => {
    const newSummary = document.summary.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdate({ summary: newSummary });
  };

  const removeField = (id: string) => {
    const newSummary = document.summary.filter(item => item.id !== id);
    onUpdate({ summary: newSummary });
  };

  const addField = () => {
    const newField: SummaryField = {
      id: Math.random().toString(36).substr(2, 9),
      key: "Total",
      value: "",
      field_type: "currency",
      confidence: 1.0
    };
    onUpdate({ summary: [...document.summary, newField] });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 border-b border-slate-100 pb-2">Summary & Totals</h3>
      
      <div className="space-y-3">
        {document.summary.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 justify-end">
             <div className="w-1/3">
                <input
                  type="text"
                  value={item.key}
                  onChange={(e) => updateSummaryField(item.id, 'key', e.target.value)}
                  className="w-full text-sm font-medium text-slate-600 text-right bg-transparent border-none focus:ring-0 placeholder-slate-300 bangla-text"
                  placeholder="Label"
                />
              </div>
              
              <div className="w-1/3">
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateSummaryField(item.id, 'value', e.target.value)}
                  className="w-full text-base font-bold text-slate-900 border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                />
              </div>

              <div className="flex items-center space-x-2">
                <ConfidenceBadge confidence={item.confidence} />
                <button 
                  onClick={() => removeField(item.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={addField}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Summary Field
        </button>
      </div>
    </div>
  );
};

export default SummarySection;