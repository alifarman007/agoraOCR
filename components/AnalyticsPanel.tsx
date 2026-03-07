import React, { useState } from 'react';
import { BarChart3, ChevronDown, ChevronUp, Coins, Zap } from 'lucide-react';
import { OCRResult, ModelType, UsageMetadata } from '../types';
import { calculateCost } from '../utils/costCalculator';

interface AnalyticsPanelProps {
  result?: OCRResult | null;
  ocrUsage?: UsageMetadata | null;
  structuringUsage?: UsageMetadata | null;
  modelUsed?: string;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ 
  result, 
  ocrUsage, 
  structuringUsage, 
  modelUsed 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Determine which data to use
  const usage1 = result?.usageMetadata || ocrUsage;
  const usage2 = structuringUsage;
  const model = (result?.modelUsed || modelUsed) as ModelType;

  if (!usage1 && !usage2) return null;

  // Calculate combined totals if both exist
  const totalPromptTokens = (usage1?.promptTokenCount || 0) + (usage2?.promptTokenCount || 0);
  const totalCandidatesTokens = (usage1?.candidatesTokenCount || 0) + (usage2?.candidatesTokenCount || 0);
  const totalTokens = (usage1?.totalTokenCount || 0) + (usage2?.totalTokenCount || 0);

  const costs = calculateCost(
    model, 
    totalPromptTokens, 
    totalCandidatesTokens
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
            ({totalTokens.toLocaleString()} tokens)
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
                {usage1 && (
                  <div className="flex justify-between text-xs text-slate-500 italic">
                    <span>Step 1: OCR Extraction</span>
                    <span>{(usage1.totalTokenCount || 0).toLocaleString()}</span>
                  </div>
                )}
                {usage2 && (
                  <div className="flex justify-between text-xs text-slate-500 italic">
                    <span>Step 2: Data Structuring</span>
                    <span>{(usage2.totalTokenCount || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-1 border-t border-slate-100"></div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Input Tokens:</span>
                  <span className="font-mono text-slate-900">{totalPromptTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Output Tokens:</span>
                  <span className="font-mono text-slate-900">{totalCandidatesTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-100 font-medium">
                  <span className="text-slate-800">Total Tokens:</span>
                  <span className="font-mono text-indigo-600">{totalTokens.toLocaleString()}</span>
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
                <p className="text-[10px] text-slate-400 mt-2">
                  * Based on {model.includes('pro') ? 'Gemini 3.0 Pro' : 'Gemini 3.0 Flash'} pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
