import React from 'react';
import { DeliveryChalanDocument, PartyInfo } from '../../types/delivery-chalan';
import { MapPin, Phone, User, Plus, Trash2 } from 'lucide-react';

interface PartyInfoSectionProps {
  document: DeliveryChalanDocument;
  onUpdate: (updates: Partial<DeliveryChalanDocument>) => void;
}

const PartyInfoSection: React.FC<PartyInfoSectionProps> = ({ document, onUpdate }) => {
  
  const updateParty = (type: 'supplier' | 'buyer', field: keyof PartyInfo, value: any) => {
    onUpdate({
      [type]: {
        ...document[type],
        [field]: value
      }
    });
  };

  const updateAdditional = (type: 'supplier' | 'buyer', key: string, value: string) => {
    onUpdate({
      [type]: {
        ...document[type],
        additional: {
          ...document[type].additional,
          [key]: value
        }
      }
    });
  };

  const addAdditionalField = (type: 'supplier' | 'buyer') => {
    const keyName = `Field ${Object.keys(document[type].additional || {}).length + 1}`;
    updateAdditional(type, keyName, '');
  };

  const renderPartyCard = (type: 'supplier' | 'buyer', title: string, data: PartyInfo) => (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col h-full">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
        {title}
      </h3>
      
      <div className="space-y-4 flex-grow">
        <div className="flex items-start space-x-3">
          <User className="h-4 w-4 text-slate-400 mt-1" />
          <div className="flex-grow">
            <label className="block text-xs text-slate-400 mb-0.5">Name</label>
            <input
              type="text"
              className="w-full text-sm font-medium border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border p-1.5 bangla-text"
              value={data.name || ''}
              onChange={(e) => updateParty(type, 'name', e.target.value)}
              placeholder="Name..."
            />
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-4 w-4 text-slate-400 mt-1" />
          <div className="flex-grow">
            <label className="block text-xs text-slate-400 mb-0.5">Address</label>
            <textarea
              className="w-full text-sm border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border p-1.5 resize-none h-20 bangla-text"
              value={data.address || ''}
              onChange={(e) => updateParty(type, 'address', e.target.value)}
              placeholder="Address details..."
            />
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Phone className="h-4 w-4 text-slate-400 mt-1" />
          <div className="flex-grow">
            <label className="block text-xs text-slate-400 mb-0.5">Phone</label>
            <input
              type="text"
              className="w-full text-sm border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 border p-1.5"
              value={data.phone || ''}
              onChange={(e) => updateParty(type, 'phone', e.target.value)}
              placeholder="Phone number..."
            />
          </div>
        </div>

        {data.additional && Object.entries(data.additional).map(([key, value], idx) => (
          <div key={idx} className="flex items-center space-x-2 pt-2 border-t border-slate-50">
            <input 
              className="w-1/3 text-xs font-medium text-slate-500 border-none focus:ring-0 bg-transparent text-right"
              value={key}
              onChange={(e) => {
                 const newAdditional = { ...data.additional };
                 delete newAdditional[key];
                 newAdditional[e.target.value] = value;
                 updateParty(type, 'additional', newAdditional);
              }}
            />
            <span className="text-slate-300">:</span>
            <input
              className="flex-grow text-sm border-slate-200 rounded-md p-1 border bangla-text"
              value={value}
              onChange={(e) => updateAdditional(type, key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => addAdditionalField(type)}
        className="mt-4 flex items-center justify-center text-xs text-blue-600 hover:text-blue-800 font-medium py-2 border border-dashed border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
      >
        <Plus className="h-3 w-3 mr-1" /> Add Field
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {renderPartyCard('supplier', 'Supplier (From)', document.supplier)}
      {renderPartyCard('buyer', 'Buyer (To)', document.buyer)}
    </div>
  );
};

export default PartyInfoSection;