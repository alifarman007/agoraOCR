import React, { useState } from 'react';
import { BarChart3, ChevronDown, ChevronUp, Coins, Zap } from 'lucide-react';
import { OCRResult, ModelType } from '../types';
import { calculateCost } from '../utils/costCalculator';

interface AnalyticsPanelProps {
  result: OCRResult | null;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!result || !result.usageMetadata) return null;

  const { promptTokenCount, candidatesTokenCount, totalTokenCount } = result.usageMetadata;
  const costs = calculateCost(
    result.modelUsed as ModelType, 
    promptTokenCount, 
    candidatesTokenCount
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center space-x-2 text-slate-700">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold text-sm">Processing Analytics</span>
          <span className="text-xs text-slate-500 font-normal ml-2">
            ({totalTokenCount.toLocaleString()} tokens)
          </span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Token Usage */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                <Zap className="h-3 w-3 mr-1" /> Token Usage
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Input (Image/PDF + Prompt):</span>
                  <span className="font-mono text-slate-900">{promptTokenCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Output (Extracted Text):</span>
                  <span className="font-mono text-slate-900">{candidatesTokenCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-100 font-medium">
                  <span className="text-slate-800">Total Tokens:</span>
                  <span className="font-mono text-indigo-600">{totalTokenCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Cost Estimates */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                <Coins className="h-3 w-3 mr-1" /> Estimated Cost
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Processing Cost:</span>
                  <span className="font-mono text-slate-900">${costs.inputCost.toFixed(6)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Generation Cost:</span>
                  <span className="font-mono text-slate-900">${costs.outputCost.toFixed(6)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-100 font-medium">
                  <span className="text-slate-800">Total Request Cost:</span>
                  <span className="font-mono text-green-600">${costs.totalCost.toFixed(6)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;