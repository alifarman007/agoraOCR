import React from 'react';
import { DeliveryChalanDocument, MetadataField } from '../../types/delivery-chalan';
import ConfidenceBadge from './ConfidenceBadge';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface MetadataSectionProps {
  document: DeliveryChalanDocument;
  onUpdate: (updates: Partial<DeliveryChalanDocument>) => void;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ document, onUpdate }) => {
  
  const updateMetadataField = (id: string, field: keyof MetadataField, value: any) => {
    const newMetadata = document.additional_metadata.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdate({ additional_metadata: newMetadata });
  };

  const removeField = (id: string) => {
    const newMetadata = document.additional_metadata.filter(item => item.id !== id);
    onUpdate({ additional_metadata: newMetadata });
  };

  const addField = () => {
    const newField: MetadataField = {
      id: Math.random().toString(36).substr(2, 9),
      key: "New Field",
      value: "",
      field_type: "text",
      confidence: 1.0
    };
    onUpdate({ additional_metadata: [...document.additional_metadata, newField] });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6 overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-700">Additional Metadata</h3>
      </div>
      
      <div className="p-4">
        {document.additional_metadata.length === 0 && (
          <p className="text-sm text-slate-400 italic text-center py-2">No additional fields found.</p>
        )}
        
        <div className="space-y-3">
          {document.additional_metadata.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 group">
              <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
              
              <div className="w-1/3">
                <input
                  type="text"
                  value={item.key}
                  onChange={(e) => updateMetadataField(item.id, 'key', e.target.value)}
                  className="w-full text-xs font-semibold text-slate-600 bg-slate-50 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded px-2 py-1.5 focus:outline-none bangla-text"
                />
              </div>
              
              <div className="flex-grow">
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateMetadataField(item.id, 'value', e.target.value)}
                  className="w-full text-sm text-slate-900 border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bangla-text"
                />
              </div>

              <div className="w-24">
                <select
                  value={item.field_type}
                  onChange={(e) => updateMetadataField(item.id, 'field_type', e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded px-1 py-1.5 bg-white"
                >
                  <option value="text">Text</option>
                  <option value="date">Date</option>
                  <option value="number">Number</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              <div className="w-20 flex items-center justify-end space-x-2">
                <ConfidenceBadge confidence={item.confidence} />
                <button 
                  onClick={() => removeField(item.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addField}
          className="mt-4 flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Metadata Field
        </button>
      </div>
    </div>
  );
};

export default MetadataSection;