import React, { useState } from 'react';
import { DeliveryChalanDocument } from '../../types/delivery-chalan';
import { Check, Copy, Download, AlertTriangle, FileSpreadsheet, Loader2 } from 'lucide-react';
import { generateExcel } from '../../utils/excelGenerator';

interface SubmitPanelProps {
  document: DeliveryChalanDocument;
  correctionCount: number;
}

const SubmitPanel: React.FC<SubmitPanelProps> = ({ document: chalanData, correctionCount }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chalanData, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chalanData, null, 2));
    const downloadAnchorNode = window.document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `chalan_${chalanData.chalan_number || 'export'}.json`);
    window.document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      await generateExcel(chalanData);
    } catch (error) {
      console.error("Failed to export Excel:", error);
      alert("Failed to generate Excel file. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between sticky bottom-0 z-10 shadow-lg">
      <div className="flex items-center space-x-4 text-sm text-slate-500">
        <span>{correctionCount} corrections made</span>
        {correctionCount > 0 && <span className="text-orange-500 flex items-center text-xs"><AlertTriangle className="h-3 w-3 mr-1" /> Edited</span>}
      </div>

      <div className="flex space-x-3 items-center">
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
             isCopied 
             ? 'bg-green-100 text-green-800 border border-green-200' 
             : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="hidden sm:inline">{isCopied ? 'JSON Copied' : 'Copy JSON'}</span>
        </button>

        <button
          onClick={handleDownloadJSON}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all"
        >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download JSON</span>
        </button>

        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
            <span>Export to Excel</span>
        </button>
      </div>
    </div>
  );
};

export default SubmitPanel;