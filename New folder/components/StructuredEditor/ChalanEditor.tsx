import React, { useState } from 'react';
import { DeliveryChalanDocument } from '../../types/delivery-chalan';
import HeaderSection from './HeaderSection';
import PartyInfoSection from './PartyInfoSection';
import MetadataSection from './MetadataSection';
import LineItemsTable from './LineItemsTable';
import SummarySection from './SummarySection';
import SubmitPanel from './SubmitPanel';
import { ChevronRight, ChevronLeft, FileText } from 'lucide-react';

interface ChalanEditorProps {
  initialDocument: DeliveryChalanDocument;
  imageUrl: string;
}

const ChalanEditor: React.FC<ChalanEditorProps> = ({ initialDocument, imageUrl }) => {
  const [document, setDocument] = useState<DeliveryChalanDocument>(initialDocument);
  const [correctionCount, setCorrectionCount] = useState(0);
  const [showRawText, setShowRawText] = useState(false);

  const handleUpdate = (updates: Partial<DeliveryChalanDocument>) => {
    setDocument(prev => ({ ...prev, ...updates }));
    setCorrectionCount(c => c + 1);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
      
      {/* LEFT PANEL: Image Viewer */}
      <div className="w-2/5 flex flex-col border-r border-slate-200 bg-slate-800 relative group">
        <div className="flex-grow overflow-auto flex items-center justify-center p-4">
           <img src={imageUrl} alt="Original Chalan" className="max-w-full h-auto shadow-2xl rounded" />
        </div>
        
        {/* Raw Text Drawer */}
        <div className={`absolute bottom-0 left-0 right-0 bg-white transition-all duration-300 ease-in-out flex flex-col ${showRawText ? 'h-1/2 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]' : 'h-10'}`}>
            <button 
                onClick={() => setShowRawText(!showRawText)}
                className="flex items-center justify-between px-4 h-10 bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider w-full hover:bg-slate-700 transition-colors"
            >
                <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-2" />
                    Raw OCR Text (Reference)
                </div>
                {showRawText ? <ChevronRight className="h-4 w-4 rotate-90" /> : <ChevronLeft className="h-4 w-4 rotate-90" />}
            </button>
            <div className="flex-grow overflow-auto p-4 font-mono text-xs text-slate-600 bg-slate-50 whitespace-pre-wrap">
                {document.raw_ocr_text}
            </div>
        </div>
      </div>

      {/* RIGHT PANEL: Editor Form */}
      <div className="w-3/5 flex flex-col bg-white">
        <div className="flex-grow overflow-y-auto p-6 scroll-smooth">
           <HeaderSection document={document} onUpdate={handleUpdate} />
           
           <PartyInfoSection document={document} onUpdate={handleUpdate} />
           
           <MetadataSection document={document} onUpdate={handleUpdate} />
           
           <LineItemsTable document={document} onUpdate={handleUpdate} />
           
           <SummarySection document={document} onUpdate={handleUpdate} />
        </div>
        
        <SubmitPanel document={document} correctionCount={correctionCount} />
      </div>
    </div>
  );
};

export default ChalanEditor;