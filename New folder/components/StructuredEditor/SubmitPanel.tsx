import React, { useState } from 'react';
import { DeliveryChalanDocument } from '../../types/delivery-chalan';
import { Check, Copy, Download, AlertTriangle } from 'lucide-react';

interface SubmitPanelProps {
  document: DeliveryChalanDocument;
  correctionCount: number;
}

const SubmitPanel: React.FC<SubmitPanelProps> = ({ document: chalanData, correctionCount }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chalanData, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chalanData, null, 2));
    const downloadAnchorNode = window.document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `chalan_${chalanData.chalan_number || 'export'}.json`);
    window.document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between sticky bottom-0 z-10 shadow-lg">
      <div className="flex items-center space-x-4 text-sm text-slate-500">
        <span>{correctionCount} corrections made</span>
        {correctionCount > 0 && <span className="text-orange-500 flex items-center text-xs"><AlertTriangle className="h-3 w-3 mr-1" /> Edited</span>}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
             isCopied 
             ? 'bg-green-100 text-green-800 border border-green-200' 
             : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{isCopied ? 'JSON Copied' : 'Copy JSON'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
        >
            <Download className="h-4 w-4" />
            <span>Download JSON</span>
        </button>
      </div>
    </div>
  );
};

export default SubmitPanel;