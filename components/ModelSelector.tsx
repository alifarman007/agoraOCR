import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import { ModelType } from '../types';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  disabled: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const models = [
    { id: ModelType.GEMINI_3_PRO, name: '3.0 Pro', desc: 'Highest reasoning & layout preservation' },
    { id: ModelType.GEMINI_3_FLASH, name: '3.0 Flash', desc: 'Fastest, optimized for high volume' },
    { id: ModelType.GEMINI_2_5_FLASH, name: '2.5', desc: 'Balanced performance' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center space-x-2 text-slate-700">
          <Settings className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-sm">Model Configuration</span>
          <span className="text-xs text-slate-500 font-normal ml-2">
            ({models.find(m => m.id === selectedModel)?.name})
          </span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-200 space-y-3">
          <p className="text-xs text-slate-500 mb-2">Select the specific neural engine for OCR processing:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => onModelChange(model.id)}
                disabled={disabled}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all ${
                  selectedModel === model.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-2 w-full mb-1">
                  <Cpu className={`h-4 w-4 ${selectedModel === model.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${selectedModel === model.id ? 'text-blue-900' : 'text-slate-700'}`}>
                    {model.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{model.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;